// FIX: Import firebase to use v8/compat types and functions.
import React, { useState, useCallback, useEffect } from 'react';
import firebase from 'firebase/app';

// FIX: Firebase v9 modular imports are not working, switching to v8 compat usage.
// Note: individual functions are no longer imported.
// import { User } from 'firebase/auth';
// import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import { httpsCallable } from 'firebase/functions';

import { auth, db, storage, functions } from './firebase.config';
import { InspectionData } from './types';
import { INSPECTION_SECTIONS } from './constants';

import Header from './components/Header';
import ProgressBar from './components/ProgressBar';
import WizardStep from './components/WizardStep';
import SummaryScreen from './components/SummaryScreen';
import WizardControls from './components/WizardControls';
import LoginScreen from './components/LoginScreen';

// A simple polyfill for uuid if it's not available in the environment
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


const App: React.FC = () => {
  // FIX: Use firebase.auth.User type from v8/compat SDK.
  const [user, setUser] = useState<firebase.auth.User | null>(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [inspectionData, setInspectionData] = useState<InspectionData>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastInspectionId, setLastInspectionId] = useState<string | null>(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setLoadingAuthState(false);
    });
    return () => unsubscribe();
  }, []);

  const totalSteps = INSPECTION_SECTIONS.length;
  const isSummaryStep = currentStep === totalSteps;

  const handleDataChange = useCallback((sectionId: string, itemId: string, field: string, value: string | File | null) => {
    setInspectionData(prevData => {
      const sectionData = prevData[sectionId] || {};
      const itemData = sectionData[itemId] || { photo: null, video: null, comment: '', document: null };

      return {
        ...prevData,
        [sectionId]: {
          ...sectionData,
          [itemId]: {
            ...itemData,
            [field]: value,
          },
        },
      };
    });
  }, []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(step => step + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(step => step + 1);
    }
  };
  
  const handleStartNew = () => {
    setCurrentStep(0);
    setInspectionData({});
    setLastInspectionId(null);
  }

  const handleLogout = async () => {
    await auth.signOut();
    // Reset state on logout
    handleStartNew();
  };

  const handleGenerateReport = async () => {
    if (!user) {
      alert("You must be logged in to generate a report.");
      return;
    }
    setIsGenerating(true);
    try {
      const inspectionId = generateUUID();
      const firestoreData: { [key: string]: any } = {};
      const uploadPromises: Promise<void>[] = [];

      for (const section of INSPECTION_SECTIONS) {
        const sectionData = inspectionData[section.id];
        if (!sectionData) continue;
        
        firestoreData[section.id] = {};

        for (const item of section.items) {
          const itemData = sectionData[item.id];
          if (!itemData) continue;

          const firestoreItemData: any = { comment: itemData.comment };
          
          (['photo', 'video', 'document'] as const).forEach(fileType => {
            const file = itemData[fileType];
            if (file instanceof File) {
              const storagePath = `inspections/${user.uid}/${inspectionId}/${section.id}-${item.id}-${file.name}`;
              // FIX: Use v8/compat syntax for storage reference.
              const storageRef = storage.ref(storagePath);
              
              // FIX: Use v8/compat syntax for file upload and getting download URL.
              const uploadPromise = storageRef.put(file).then(snapshot => 
                snapshot.ref.getDownloadURL().then(url => {
                  firestoreItemData[fileType] = url;
                })
              );
              uploadPromises.push(uploadPromise as Promise<void>);
            } else {
              firestoreItemData[fileType] = null;
            }
          });
          firestoreData[section.id][item.id] = firestoreItemData;
        }
      }

      await Promise.all(uploadPromises);

      // FIX: Use v8/compat syntax for adding a document to Firestore.
      const docRef = await db.collection('inspections').add({
        userId: user.uid,
        userEmail: user.email,
        // FIX: Use v8/compat syntax for server timestamp.
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        data: firestoreData,
      });
      
      setLastInspectionId(docRef.id);
      alert("Report successfully generated and saved!");
      
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report. Please check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAiAnalysis = async (inspectionId: string) => {
    setIsAnalyzing(true);
    try {
      // FIX: Use v8/compat syntax for getting a callable function.
      const processInspection = functions.httpsCallable('processInspection');
      const result = await processInspection({ inspectionId });
      
      const data = result.data as { success: boolean; message?: string; error?: string };

      if (!data.success) {
        throw new Error(data.error || 'AI analysis failed on the backend.');
      }
      
      alert('AI analysis complete! The report has been updated.');

    } catch (error) {
      console.error("Error during AI analysis:", error);
      alert(`Failed to run AI analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };


  if (loadingAuthState) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto p-4 max-w-2xl">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <div className="bg-white rounded-lg shadow-md p-6 mt-4">
          {isSummaryStep ? (
            <SummaryScreen 
              onGenerateReport={handleGenerateReport} 
              isGenerating={isGenerating}
              lastInspectionId={lastInspectionId}
              onAiAnalysis={handleAiAnalysis}
              isAnalyzing={isAnalyzing}
              onStartNew={handleStartNew}
            />
          ) : (
            <WizardStep
              section={INSPECTION_SECTIONS[currentStep]}
              data={inspectionData[INSPECTION_SECTIONS[currentStep].id] || {}}
              onDataChange={handleDataChange}
            />
          )}
        </div>
      </main>
      <WizardControls
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrev={handlePrev}
        onNext={handleNext}
        isSummaryStep={isSummaryStep}
        reportGenerated={!!lastInspectionId}
      />
    </div>
  );
};

export default App;
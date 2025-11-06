import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GoogleGenAI } from "@google/genai";
import { ImageAnnotatorClient } from "@google-cloud/vision";
import * as cors from "cors";

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();
const visionClient = new ImageAnnotatorClient();

// Initialize Gemini API
// For local development, use .env file. For production, set with `firebase functions:config:set gemini.key="..."`
const geminiApiKey = process.env.GEMINI_API_KEY || functions.config().gemini.key;
if (!geminiApiKey) {
  console.error("Gemini API key not found. Please set it in environment variables.");
}
const ai = new GoogleGenAI({ apiKey: geminiApiKey });


const corsHandler = cors({ origin: true });

export const processInspection = functions.https.onRequest((request, response) => {
  corsHandler(request, response, async () => {
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    try {
      const { inspectionId } = request.body;
      if (!inspectionId) {
        response.status(400).json({ success: false, error: "inspectionId is required" });
        return;
      }

      const inspectionRef = db.collection("inspections").doc(inspectionId);
      const inspectionDoc = await inspectionRef.get();

      if (!inspectionDoc.exists) {
        response.status(404).json({ success: false, error: "Inspection not found" });
        return;
      }

      const inspectionData = inspectionDoc.data()?.data;
      if (!inspectionData) {
        response.status(400).json({ success: false, error: "Malformed inspection data" });
        return;
      }

      // 1. Analyze text comments with Gemini API
      let allComments = "";
      let firstPhotoUrl = "";

      for (const sectionKey in inspectionData) {
        for (const itemKey in inspectionData[sectionKey]) {
          const item = inspectionData[sectionKey][itemKey];
          if (item.comment) {
            allComments += `${item.comment}\n`;
          }
          if (item.photo && !firstPhotoUrl) {
            firstPhotoUrl = item.photo;
          }
        }
      }

      let aiSummary = "No comments to analyze.";
      if (allComments.trim()) {
        const prompt = `Summarize the following property inspection notes, highlighting potential issues, risks, or areas needing maintenance:\n\n---\n${allComments.trim()}\n---`;
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        aiSummary = result.text;
      }

      // 2. Analyze the main photo with Vision API
      let objectTags: string[] = [];
      if (firstPhotoUrl) {
        const [result] = await visionClient.labelDetection(firstPhotoUrl);
        const labels = result.labelAnnotations;
        if (labels) {
          objectTags = labels.map((label) => label.description || "").filter(Boolean);
        }
      }

      // 3. (Placeholder) Call third-party API for pricing
      const estimatedPrice = "Awaiting third-party estimate.";
      // Example:
      // const priceResponse = await fetch(`https://api.olx-price-api.com/estimate`, {
      //   method: 'POST',
      //   body: JSON.stringify({ description: allComments, tags: objectTags })
      // });
      // const priceData = await priceResponse.json();
      // estimatedPrice = priceData.price;


      // 4. Update the original Firestore document
      await inspectionRef.update({
        analysis: {
          aiSummary,
          objectTags,
          estimatedPrice,
          analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      });

      response.status(200).json({ success: true, message: "Inspection processed successfully." });
    } catch (error) {
      console.error("Error processing inspection:", error);
      if (error instanceof Error) {
        functions.logger.error("Error in processInspection", { error: error.message, stack: error.stack });
        response.status(500).json({ success: false, error: "Internal Server Error" });
      } else {
        response.status(500).json({ success: false, error: "An unknown error occurred" });
      }
    }
  });
});

import { formatAnalysisText } from "@/lib/utils";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);
export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this plant image and provide information in strict markdown format following this structure:

# [Common Name] ([Scientific Name]) Analysis

## 1. Plant Identification
- **Common Name**: 
- **Scientific Name**: 

## 2. Physical Description
- **Morphological Characteristics**:
  - Growth pattern:
  - Leaf structure:
  - Flower features:
  - Stem characteristics:
  - Special adaptations:

## 3. Health Assessment
- **Current Health Status**:
  - Vitality indicators:
  - Common ailments/diseases:
  - Pest susceptibility:

## 4. Origin & Habitat
- **Natural Habitat**:
  - Geographical origin:
  - Ecosystem type:
  - Climate requirements:

## 5. Medicinal Properties
- **Therapeutic Applications**:
  - Traditional remedies:
  - Modern medical uses:
  - Active compounds:
  - Preparation methods:

## 6. Cultivation Guide
- **Growth Requirements**:
  - Soil type:
  - Water needs:
  - Light exposure:
  - Temperature range:

## 7. Socio-Economic Value
- **Economic Importance**:
- **Cultural Significance**:

## 8. Research Opportunities
1. **Project Idea 1**: [Title] - [Brief description]
2. **Project Idea 2**: [Title] - [Brief description]
3. **Project Idea 3**: [Title] - [Brief description]

**Instructions**:
1. Use only ## headers and -/1. list formats
2. Skip entire sections if information is unavailable
3. Be specific with measurements (metric units)
4. Include regional names if applicable
5. Prioritize verifiable scientific information
6. For research topics, focus on sustainable applications`;

    // const result = await model.generateContent({
    //   contents: [
    //     {
    //       parts: [
    //         { text: prompt },
    //         {
    //           inline_data: {
    //             mime_type: "image/jpeg",
    //             data: image.split(",")[1],
    //           },
    //         },
    //       ],
    //     },
    //   ],
    // });
    // Updated API call format
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image.split(",")[1],
              },
            },
          ],
        },
      ],
    });
    const response = await result.response;
    const text = response.text();
    const formattedText = formatAnalysisText(text);

    return NextResponse.json({ analysis: formattedText });
  } catch (error) {
    console.error("Error analyzing plant:", error);
    return NextResponse.json(
      { error: "Failed to analyze plant image" },
      { status: 500 }
    );
  }
}

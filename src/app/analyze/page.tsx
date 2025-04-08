"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  ImageIcon,
  FileText,
  Loader2,
  Microscope,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AnalyzePage() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  //   useEffect(() => {
  //     if (selectedImage) {
  //       const img = document.createElement("img");
  //       img.src = selectedImage;
  //       img.onload = () => {
  //         // Image loaded successfully
  //         console.log("Image loaded successfully");
  //       };
  //       img.onerror = () => {
  //         // Error loading image
  //         console.error("Error loading image");
  //         setError("Error loading image. Please try again.");
  //         setSelectedImage(null);
  //       };
  //     }
  //   }, [selectedImage]);
  useEffect(() => {
    if (selectedImage) {
      const img = document.createElement("img");
      img.src = selectedImage;
      img.onload = () => {
        console.log("Image loaded successfully");
      };
      img.onerror = () => {
        console.error("Error loading image");
        setError("Error loading image. Please try again.");
        setSelectedImage(null);
        toast({
          title: "Error",
          description: "Failed to load the image. Please try again.",
          variant: "destructive",
        });
      };
    }
  }, [selectedImage, toast]);
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    setError(null);
    setAnalysis(null);

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      toast({
        title: "Invalid File",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
        toast({
          title: "Image Uploaded",
          description: "Your image has been successfully uploaded.",
          variant: "default",
        });
      }
    };
    reader.onerror = () => {
      setError("Error reading file. Please try again.");
      toast({
        title: "Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    try {
      setIsAnalyzing(true);
      setError(null);

      if (!selectedImage) {
        throw new Error("No image selected");
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: selectedImage }),
      });

      if (!response.ok) {
        throw new Error("Analysis failed");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysis(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your plant analysis report is ready.",
        variant: "default",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Analysis Failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          analysis,
          image: selectedImage,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "plant-analysis.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast({
        title: "PDF Generated",
        description: "Your plant analysis PDF has been downloaded.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setError("Failed to download PDF report");
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate and download the PDF report.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  type Section = {
    title: string;
    content: string[];
  };

  const parseAnalysis = (text: string): Section[] => {
    const sections = text.split("##").filter((s) => s.trim());
    return sections.map((section) => {
      const [title, ...content] = section
        .split("\n")
        .filter((line) => line.trim());
      return {
        title: title.trim(),
        content: content.map((line) => line.trim().replace(/^\s*-\s*/, "")),
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="responsive-container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Analyze Your Plant</h1>
          <p className="text-muted-foreground">
            Upload a clear photo of the plant you want to identify and analyze
          </p>
        </div>
        <Card
          className={cn(
            "relative min-h-[400px] transition-colors duration-300",
            dragActive ? "border-green-500 bg-green-50" : ""
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept="image/*"
            onChange={handleChange}
          />
          <label
            htmlFor="file-upload"
            className="flex min-h-[400px] cursor-pointer flex-col items-center justify-center gap-4 p-8"
          >
            {selectedImage ? (
              <div className="relative w-full h-[300px] flex items-center justify-center">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Selected plant"
                  className="max-w-full max-h-full object-contain"
                  width={300}
                  height={300}
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4 rounded-full w-16 h-16 bg-green-100 flex items-center justify-center mx-auto">
                  <ImageIcon className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-lg font-medium mb-2">
                  Drop your plant image here
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to select a file
                </p>
                <Button variant="outline" className="pointer-events-none">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
            )}
          </label>
        </Card>
        {error && (
          <div className="mt-4 p-4 text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}
        {selectedImage && (
          <div className="mt-6 flex justify-center gap-4">
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Microscope className="mr-2 h-4 w-4" />
                  Analyze Plant
                </>
              )}
            </Button>
            <Button variant="outline" onClick={() => setSelectedImage(null)}>
              Choose Different Image
            </Button>
          </div>
        )}
        {analysis && (
          <Card className="mt-8 p-6">
            <h1 className="text-2xl font-bold text-center text-green-800 mb-6">
              Plant Analysis Report
            </h1>

            {selectedImage && (
              <div className="relative w-full h-[300px] mb-8">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Analyzed plant"
                  className="object-contain rounded-lg"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="space-y-8">
              {parseAnalysis(analysis).map((section, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 pb-6 last:border-0"
                >
                  <h2 className="text-xl font-semibold text-green-700 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-2">
                    {section.content.map((item, i) => (
                      <div key={i} className="text-gray-700 leading-relaxed">
                        {item.startsWith("*") ? (
                          <p className="italic">{item}</p>
                        ) : item.match(/^\d\./) ? (
                          <div className="ml-4 mt-2">
                            <span className="font-medium">{item}</span>
                          </div>
                        ) : (
                          <div className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Download PDF Report
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

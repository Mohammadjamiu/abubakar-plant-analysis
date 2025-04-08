import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type React from "react";

// We'll use a web-safe font that doesn't require loading external files
Font.register({
  family: "Helvetica",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QIFqPfE.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFqPfE.ttf",
      fontWeight: 700,
    },
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QYFqPfE.ttf",
      fontStyle: "italic",
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 20,
    color: "#2E7D32",
  },
  section: {
    marginBottom: 6,
    marginTop: 7,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 1,
    color: "#2E7D32",
    borderBottom: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 5,
  },
  content: {
    fontSize: 11,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  listItem: {
    marginLeft: 20,
    marginBottom: 5,
  },
  image: {
    marginVertical: 20,
    width: "auto",
    height: 200,
    alignSelf: "center",
  },
  disclaimer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: "center",
    fontStyle: "italic",
    color: "#666666",
    borderTop: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 20,
  },

  watermark: {
    position: "absolute",
    bottom: "30%",
    left: "20%",
    opacity: 0.1,
    transform: "rotate(-45deg)",
  },
  watermarkText: {
    fontSize: 48,
    color: "#666",
    fontWeight: "bold",
  },
  credit: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    color: "#2c5f2d",
  },
  creditLink: {
    color: "#2c5f2d",
    textDecoration: "none",
  },
});

// Create PDF Template component
export const PlantPDFTemplate: React.FC<{
  analysis: string;
  image: string;
}> = ({ analysis, image }) => {
  const sections = analysis.split("\n").filter((line) => line.trim());

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark Container */}
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>Project by Abubakar T.S</Text>
        </View>

        <Text style={styles.title}>Plant Analysis Report</Text>

        {image && <Image src={image} style={styles.image} />}

        {sections.map((line, index) => {
          if (line.startsWith("##")) {
            return (
              <View key={index} style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {line.replace("##", "").trim()}
                </Text>
              </View>
            );
          }

          if (line.startsWith("-")) {
            return (
              <Text key={index} style={[styles.content, styles.listItem]}>
                {`• ${line.substring(1).trim()}`}
              </Text>
            );
          }

          return (
            <Text key={index} style={styles.content}>
              {line.trim()}
            </Text>
          );
        })}
      </Page>
    </Document>
  );
};

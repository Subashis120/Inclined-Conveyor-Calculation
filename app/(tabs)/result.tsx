import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useTheme } from "@react-navigation/native";
import { Stack } from "expo-router";
import {logoBase64} from "../../components/utils/Base64.js";

const screenWidth = Dimensions.get("window").width;

export default function Result() {
  const params = useLocalSearchParams();

  console.log("Params received:", params);

  const { colors } = useTheme();

  let resultMap: any = {};
  let inputData: any = {};

  // SAFE JSON PARSE
  try {
    resultMap = JSON.parse(params.data as string);
    inputData = JSON.parse(params.input as string);
  } catch (e) {
    console.error("JSON parse failed:", e);
    resultMap = {};
  }

  const inputEntries = Object.entries(inputData);
  const rows = chunkArray(inputEntries, 4);

  const Row = ({ children }) => (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
      {children}
    </View>
  );

  const Col = ({ label, children }) => (
    <View style={{ flex: 2 }}>
      <Text style={{ marginBottom: 6, fontWeight: "600", color: "white" }}>
        {label}
      </Text>
      {children}
    </View>
  );

  console.log("resultMap received:", resultMap);

  // Extract only numeric values for charts
  const numericEntries = Object.entries(resultMap)
    .filter(([_, v]) => typeof v === "number")
    .map(([key, value]) => ({ key, value }));

  // PDF Download
  const downloadPdf = async () => {
    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          h1 { text-align: center; }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            font-size: 14px;
          }

          th {
            background-color: #f2f2f2;
          }

          /* FIXED WIDTH COLUMNS */
          .col-key {
            width: 200px;
            font-weight: bold;
            text-align: left;
          }

          .col-value {
            width: 200px;
            text-align: left;
          }
          .col-header-input{
            width: 400px;
            font-weight: bold;
            text-align: center;
          }
          img{
            margin-top: 1%;
          }
        </style>
      </head>

      <body>
          
        <h1>
          <img src="${logoBase64}" width=30 height=30/>
          Calculation Results
        </h1>
        <table>
          <tr>
            <th class="col-header-input" colspan="2">Input Data</th>
          </tr>
          <tr>
            <th class="col-key">Key</th>
            <th class="col-value">Value</th>
          </tr>

          ${Object.entries(inputData)
            .map(
              ([k, v]) => `
                <tr>
                  <td class="col-key">${k}</td>
                  <td class="col-value">${v ?? "—"}</td>
                </tr>`
            )
            .join("")}
        </table>

        <table>
          <tr>
            <th class="col-header-input" colspan="2">Output Data</th>
          </tr>
          <tr>
            <th class="col-key">Key</th>
            <th class="col-value">Value</th>
          </tr>

          ${Object.entries(resultMap)
            .map(
              ([k, v]) => `
                <tr>
                  <td class="col-key">${k}</td>
                  <td class="col-value">${v ?? "—"}</td>
                </tr>`
            )
            .join("")}
        </table>
      </body>
    </html>
  `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: false,
          headerStyle: {
            backgroundColor: "rgb(15, 32, 39)",
          },
          statusBarStyle:"light",
          headerTintColor: "white",
          headerShadowVisible: false, // remove bottom border
          headerTitle: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginLeft: -20
              }}
            >
              <Image
                source={require("@/assets/images/company-logo.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 6, // optional for rounded icon look
                  
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "600",
                }}
              >
                SDB ENGINEERING
              </Text>
            </View>
          ),
        }}
      />

      <View
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: 16,
          borderRadius: 16,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 20,
            color: "white",
            textAlign:"center"
          }}
        >
          Input Values
        </Text>

        {rows.map((group, idx) => (
          <Row key={idx}>
            {group.map(([key, valueInput]) => (
              <Col key={key} label={key}>
                <TextInput
                  value={String(valueInput)}
                  editable={false} // disabled
                  style={{
                    color: "#fff",
                    opacity: 0.7,
                    borderWidth: 2,
                    borderColor: "#555",
                    borderRadius: 8,
                    paddingTop: 8,
                    paddingBottom: 8,
                    paddingLeft:10,
                    width: 70,
                    backgroundColor: "rgba(255,255,255,0.05)",
                  }}
                />
              </Col>
            ))}
          </Row>
        ))}
      </View>

      {/* Expandable Results */}
      {/* {Object.entries(resultMap).map(([key, value]) => (
        <ExpandableCard key={key} title={key} value={value} />
      ))} */}

      {/* TABLE */}
      <View style={styles.tableCard}>
      <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginBottom: 14,
            color: "white",
            textAlign:"center"
          }}
        >
          Output Data
        </Text>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerKey}>Parameter</Text>
          <Text style={styles.headerValue}>Result</Text>
        </View>

        {/* Rows */}
        {Object.entries(resultMap).map(([key, value], index) => (
          <View
            key={key}
            style={[
              styles.dataRow,
              index % 2 === 0 ? styles.evenRow : styles.oddRow,
            ]}
          >
            <Text style={styles.keyText}>{key}</Text>
            {/* <Text style={styles.valueText}>
              {value === null || value === undefined
                ? "—"
                : typeof value === "object"
                ? JSON.stringify(value)
                : value.toString()}
            </Text> */}

            <TextInput
              value={String(
                value === null || value === undefined
                  ? "—"
                  : typeof value === "object"
                  ? JSON.stringify(value)
                  : value.toString()
              )}
              editable={false} // disabled
              style={{
                color: "#fff",
                borderWidth: 2,
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: 8,
                textAlign: "center",
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            />
          </View>
        ))}
      </View>

      {/* <View style={styles.glassBtn}>
        <Button title="Download PDF" onPress={downloadPdf} />
      </View> */}

      <TouchableOpacity
        style={styles.glassBtn}
        onPress={downloadPdf}
        activeOpacity={0.8}
      >
        <Text style={styles.glassText}>Download PDF</Text>
      </TouchableOpacity>

      {/* Pie Chart */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "700",
          marginTop: 10,
          marginBottom: 10,
          color: "white",
          textAlign: "center",
        }}
      >
        🥧 Pie Chart
      </Text>

      <PieChart
        data={numericEntries.map((e, i) => ({
          name: e.key,
          population: e.value,
          color: `rgba(255,255,0,${0.3 + i * 0.1})`,
          legendFontColor: "#fff",
          legendFontSize: 12,
        }))}
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          backgroundGradientFromOpacity: 1,
          backgroundGradientToOpacity: 1,
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(1,1,0,${opacity})`,
          labelColor: (opacity = 1) => `rgba(50,50,50,${opacity})`,
          barPercentage: 0.7,
        }}
        width={screenWidth - 20}
        height={260}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="20"
        absolute
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: "rgb(15, 32, 39)" },
  chart: {
    marginVertical: 20,
    borderRadius: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fdfdfd",
  },

  cellKey: {
    width: "50%", // Fixed width for alignment
    fontSize: 16,
    fontWeight: "600",
  },

  cellValue: {
    width: "50%",
    fontSize: 16,
    textAlign: "right",
  },

  headerText: {
    fontWeight: "200",
    fontSize: 10,
  },

  tableCard: {
    backgroundColor: "rgba(255,255,255,0.10)", // glass look
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)", // works in expo web + native fallback
  },

  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    marginBottom: 4,
    paddingHorizontal: 10,
  },

  headerKey: {
    flex: 1,
    fontWeight: "800",
    fontSize: 16,
    color: "#ffd369", // soft yellow
  },

  headerKey1: {
    flex: 1,
    fontWeight: "800",
    textAlign: "center",
    fontSize: 16,
    color: "#ffd369", // soft yellow
  },

  headerValue: {
    flex: 1,
    fontWeight: "800",
    fontSize: 16,
    textAlign: "right",
    paddingRight: 15,
    color: "#4dd0e1", // teal/cyan
  },

  dataRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },

  evenRow: {
    backgroundColor: "rgba(255,255,255,0.06)", // subtle zebra
  },

  oddRow: {
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  keyText: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    width: 10,
  },

  valueText: {
    flex: 1,
    textAlign: "right",
    color: "#e0f7fa",
    fontSize: 15,
    fontWeight: "500",
    borderColor: "rgba(255,255,255,0.2)",
  },
  glassBtn: {
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.4)",
    borderWidth: 1,
    backdropFilter: "blur(10px)", // works on web; ignored on native
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  glassText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
});

const chunkArray = (entries, size = 4) => {
  const rows = [];
  for (let i = 0; i < entries.length; i += size) {
    rows.push(entries.slice(i, i + size));
  }
  return rows;
};

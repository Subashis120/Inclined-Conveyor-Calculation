import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { fieldSchema } from "../utils/Validation";
import { calculateResult } from "../utils/Calculate";
import { LinearGradient } from "expo-linear-gradient";
import CustomAlert from "./CustomAlert";

export default function FormScreen() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const initialForm = {
    diameter: "",
    ratio: "",
    length: "",
    width: "",
    thickness: "",
    capacity: "",
    density: "",
    friction: "",
    height: "",
  };

  const [form, setForm] = useState(initialForm);

  const { colors } = useTheme();

  const handleFloatChange = (key: string, value: string) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = () => {
    try {
      fieldSchema.validateSync(form);

      const result = calculateResult(form);

      router.push({
        pathname: "/result",
        params: { data: JSON.stringify(result), input: JSON.stringify(form) },
      });
      // setForm(initialForm);
    } catch (err: any) {
      // Alert.alert("Validation Error", err.message);
      setAlertMessage(err.message);
      setAlertVisible(true);
    }
  };

  const Row = ({ children }) => (
    <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
      {children}
    </View>
  );

  const Col = ({ label, children }) => (
    <View style={{ flex: 1 }}>
      <Text style={{ marginBottom: 6, fontWeight: "600", color: "white" }}>
        {label}
      </Text>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* ---- CARD 1 ---- */}
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
            marginBottom: 14,
            color: "white",
          }}
        >
          Basic Inputs
        </Text>

        {/* Rows */}
        <Row>
          <Col label="Head Pulley (m)">
            <TextInput
              placeholder="diameter"
              placeholderTextColor="#ddd"
              value={form.diameter}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("diameter", v)}
              style={inputStyleDark}
            />
          </Col>

          <Col label="Gear Ratio (X:Y)">
            <TextInput
              placeholder="X"
              placeholderTextColor="#ddd"
              value={form.ratio}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("ratio", v)}
              style={inputStyleDark}
            />
          </Col>
        </Row>

        <Row>
          <Col label="Conveyor Height (m)">
            <TextInput
              placeholder="0.0 m"
              placeholderTextColor="#ddd"
              value={form.height}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("height", v)}
              style={inputStyleDark}
            />
          </Col>

          <Col label="Belt Capacity / m (kg)">
            <TextInput
              placeholder="0 kg"
              placeholderTextColor="#ddd"
              value={form.capacity}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("capacity", v)}
              style={inputStyleDark}
            />
          </Col>
        </Row>
      </View>

      {/* ---- CARD 2 ---- */}
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
            fontWeight: "700",
            fontSize: 18,
            marginBottom: 14,
            color: "white",
          }}
        >
          Belt Properties (m)
        </Text>

        <Row>
          <Col label="Centre Distance">
            <TextInput
              placeholder="0.0 m"
              placeholderTextColor="#ddd"
              value={form.length}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("length", v)}
              style={inputStyleDark}
            />
          </Col>

          <Col label="Width">
            <TextInput
              placeholder="0.0 m"
              placeholderTextColor="#ddd"
              value={form.width}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("width", v)}
              style={inputStyleDark}
            />
          </Col>

          <Col label="Belt Thickness">
            <TextInput
              placeholder="0.0 m"
              placeholderTextColor="#ddd"
              value={form.thickness}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("thickness", v)}
              style={inputStyleDark}
            />
          </Col>
        </Row>

        <Row>
          <Col label="Material Density">
            <TextInput
              placeholder="0.0"
              placeholderTextColor="#ddd"
              value={form.density}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("density", v)}
              style={inputStyleDark}
            />
          </Col>

          <Col label="Friction Coefficient">
            <TextInput
              placeholder="0.0"
              placeholderTextColor="#ddd"
              value={form.friction}
              keyboardType="numeric"
              onChangeText={(v) => handleFloatChange("friction", v)}
              style={inputStyleDark}
            />
          </Col>
        </Row>
      </View>

      {/* <Button title="Calculate" onPress={handleSubmit} /> */}
      <TouchableOpacity
        style={styles.glassBtn}
        onPress={handleSubmit}
        activeOpacity={0.8}
      >
        <Text style={styles.glassText}>Calculate</Text>
      </TouchableOpacity>

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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

const inputStyleDark = {
  borderWidth: 1,
  borderRadius: 10,
  padding: 10,
  borderColor: "rgba(255,255,255,0.3)",
  backgroundColor: "rgba(255,255,255,0.1)",
  color: "white",
};

const pickerDarkContainer = {
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.3)",
  borderRadius: 10,
  backgroundColor: "rgba(255,255,255,0.1)",
  overflow: "hidden",
};

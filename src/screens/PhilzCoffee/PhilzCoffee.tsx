import React from "react";
import { Dimensions, View, ScrollView, StyleSheet } from "react-native";

import { products } from "./Model";
import Card, { CARD_HEIGHT } from "./Card";
import Products from "./Products";
import Cards from "./components/Cards";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  slider: { height: CARD_HEIGHT },
});

const PhilzCoffee = () => {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <View style={styles.slider}>
          <ScrollView horizontal>
            {products.map((product, index) => (
              <Card product={product} key={index} />
            ))}
          </ScrollView>
          <Products />
        </View>
        <Cards />
      </ScrollView>
    </View>
  );
};

export default PhilzCoffee;

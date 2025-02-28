"use client";
import { Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaBasketShopping } from "react-icons/fa6";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0"];

const Dashboard = () => {
  return (
    <>
      <Flex align="center" mb="4">
        <FaBasketShopping style={{ marginRight: "8px" }} />
        <Heading as="h3" size="md">
          Produtos
        </Heading>
      </Flex>
    </>
  );
};

export default Dashboard;

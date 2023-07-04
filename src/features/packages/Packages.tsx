import React from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Image,
  Text,
  Spinner,
} from "@chakra-ui/react";
import { useGetTripsQuery } from "../trip/tripApiSlice";
import { useNavigate } from "react-router-dom";

interface TravelPackage {
  _id:string;
  title: string;
  photos: string[];
  description: string;
}

const Packages: React.FC = () => {
  //@ts-ignore
  const { data: trips, isLoading } = useGetTripsQuery(); 
  const navigate = useNavigate()
  return (
    <Box px={6} py={8}>
      <Heading as="h1" size="xl" mb={8}>
        Travel Packages Available
      </Heading>
      {isLoading && (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      )}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
        {trips?.data?.map((travelPackage: TravelPackage, index: number) => (
          <Box
            key={index}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            overflow="hidden"
            maxW={{ base: "full", md: "lg" }}
            maxH={{ base: "xs", md: "xs" }}
            minW={{ base: "full", md: "md" }}
            minH={{ base: "xs", md: "xs" }}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            onClick={() => {navigate(`/${travelPackage._id}`)}}
          >
            <Image
              src={travelPackage.photos[0]}
              alt={travelPackage.title}
              h={40}
              w="full"
              objectFit="cover"
            />  

            <Box p={4}>
              <Heading as="h2" size="md" mb={2}>
                {travelPackage.title}
              </Heading>
              <Text
                fontSize="sm"
                color="gray.600"
                noOfLines={3}
                mb={4}
                
              >
                {travelPackage.description}
                </Text>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Packages;

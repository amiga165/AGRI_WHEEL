import React from 'react';
import { VStack, Text, Box, Stack, Heading } from "native-base";
import { CONTACT } from './../constants';  
const ContactScreen = () => {
  return (
    <Box
      bg="white"
      shadow={2}
      rounded="lg"
      m={[5,5]}
    >
      <Stack space={4} p={[4, 4, 8]}>
        <Heading size={["sm"]} noOfLines={2}>
          {CONTACT.NAME}
        </Heading>
        <VStack mx={0} space="sm">
          <Text color="gray.400">{CONTACT.MOBILE}</Text>
          <Text color="gray.400">{CONTACT.MAIL}</Text>
        </VStack>
      </Stack>
      </Box>
  );
};

export default ContactScreen;

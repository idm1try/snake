import NextLink from 'next/link';
import { Box, Heading, Text, Container, Divider, Button } from '@chakra-ui/react';
import { FaHome } from 'react-icons/fa';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <Container paddingTop='40px' textAlign='center'>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Heading as='h1'>Not found</Heading>
        <Text>The page you&apos;re looking for was not found.</Text>
        <Divider my={6} />
        <Box my={6}>
          <NextLink href='/' passHref>
            <Button colorScheme='teal'>
              <Box as={FaHome} mr={1} /> Return to home
            </Button>
          </NextLink>
        </Box>
      </motion.div>
    </Container>
  );
};

export default NotFound;

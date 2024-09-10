import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Text, Button } from "@chakra-ui/react";

const DropzoneComponent = () => {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <Box
      {...getRootProps()}
      border="2px dashed teal"
      borderRadius="md"
      p={8}
      cursor="pointer"
      textAlign="center"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Text color="teal.500">Drop the files here...</Text>
      ) : (
        <Text color="gray.500">
          Drag 'n' drop some files here, or click to select files
        </Text>
      )}
      <Button mt={4} colorScheme="teal">
        Browse Files
      </Button>
    </Box>
  );
};

export default DropzoneComponent;

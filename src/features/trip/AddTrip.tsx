import { useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Image,
  Input,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm, SubmitHandler  } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { useCreateTripMutation } from "./tripApiSlice";


type Accommodation = {
    name: string;
    address: string;
    checkIn: string;
    checkOut: string;
  };
  
  type Transportation = {
    name: string;
    description: string;
  };

  type Activity = {
    name: string;
    description: string;
    location: string;
    };
  
  type AddTripFormData = {
    title: string;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    budget: number;
    tags: string[];
    images: FileList;
    accommodations: Accommodation[];
    activities: Activity[];
    transportation: Transportation[];
  };

  
  

  
  type AddTripProps = {
    onSubmit: SubmitHandler<AddTripFormData>;
  };

const AddTrip = () => {
  const { handleSubmit, register, formState: { errors }, reset} = useForm<AddTripFormData>();
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [transportation, setTransportation] = useState<Transportation[]>([]);
    const [createTrip, { isLoading }] = useCreateTripMutation();
    const toast = useToast();

   


  const onSubmit = async (data: AddTripFormData) => {
    console.log(data)
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);
    formData.append("budget", data.budget.toString());
    

    
    for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }


      
  
      for (let i = 0; i < data?.tags?.length; i++) {
        formData.append(`tags[${i}]`, data?.tags[i]);
      }
  
      for (let i = 0; i < data?.accommodations?.length; i++) {
        formData.append( `accommodation[${i}][name]`, data?.accommodations[i].name);
        formData.append(`accommodation[${i}][address]`, data?.accommodations[i].address);
        formData.append(`accommodation[${i}][checkIn]`, data?.accommodations[i].checkIn);
        formData.append(`accommodation[${i}][checkOut]`, data?.accommodations[i].checkOut);
      }
  
      for (let i = 0; i < data?.activities?.length; i++) {
        formData.append(`activities[${i}][name]`, data?.activities[i].name);
        formData.append(`activities[${i}][description]`, data?.activities[i].description);
        formData.append(`activities[${i}][location]`, data?.activities[i].location);
      }
  
      for (let i = 0; i < data?.transportation.length; i++) {
        formData.append(`transportation[${i}][name]`, data?.transportation[i].name);
        formData.append(`transportation[${i}][description]`, data?.transportation[i].description);
      }
        try {
            const resultAction = await createTrip(formData).unwrap();
          

            toast({
                title: resultAction?.message,
                status: "success",
                duration: 5000,
                isClosable: true,
                position: "top-right",
            });

            reset();
            setImages([]);
            


        } catch (error : any) {
            const { data} = error as { data: { message: string; errors?: {[key: string]: string}}};

            if(data.message === "Validation error"){
              toast({
                  title : data.message,
                  description : Object.values(data?.errors as {[key: string]: string}).join("\n"),
                  status : "error",
                  duration : 9000,
                  isClosable : true,
                  position : "top-right",
              })
          }
          else{
          toast({
              title: "An error occurred.",
              description: data.message,
              status: "error",
              duration: 9000,
              isClosable: true,
              position: "top-right",
              });

            }


        }


    
  };
  
  const handleImageDrop = (acceptedFiles: File[]) => {
    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  };
  
  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  const handleAddTag = () => {
    const tagValue = (document.getElementById("tag-input") as HTMLInputElement)?.value;
    if (tagValue && tagValue.trim() !== "") {
      setTags((prevTags) => [...prevTags, tagValue]);
      (document.getElementById("tag-input") as HTMLInputElement).value = "";
    }
  };
  
  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };
  
  const handleAddAccommodation = () => {
    setAccommodations((prevAccommodations) => [
      ...prevAccommodations,
      { name: "", address: "", checkIn: "", checkOut: "" },
    ]);
  };
  
  const handleRemoveAccommodation = (index: number) => {
    setAccommodations((prevAccommodations) =>
      prevAccommodations.filter((_, i) => i !== index)
    );
  };
  
  const handleAddActivity = () => {
    setActivities((prevActivities) => [...prevActivities, ""]);
  };
  
  const handleRemoveActivity = (index: number) => {
    setActivities((prevActivities) =>
      prevActivities.filter((_, i) => i !== index)
    );
  };
  
  const handleAddTransportation = () => {
    setTransportation((prevTransportation) => [
      ...prevTransportation,
      { name: "", description: "" },
    ]);
  };
  
  const handleRemoveTransportation = (index: number) => {
    setTransportation((prevTransportation) =>
      prevTransportation.filter((_, i) => i !== index)
    );
  };

  
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    //@ts-ignore
    accept : "image/*",
  });
  
  return (
    <Box py={4} px={4}>
        <Text
            fontSize="3xl"
            fontWeight="bold"
            textAlign="center"
            color="brand.700"
            >
            Add a new trip
        </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
          <GridItem colSpan={2}>
            <FormControl isInvalid={errors.title ? true : false}>
              <FormLabel>Title</FormLabel>
              <Input
                {...register("title", { required: "Title is required" })}
              />
              <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl isInvalid={errors.description ? true : false}>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register("description", { required: "Description is required" })}
              />
              <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
            </FormControl>
          </GridItem>

            <GridItem colSpan={1}>
            <FormControl isInvalid={errors.location ? true : false}>
                <FormLabel>Location</FormLabel>
                <Input
                {...register("location", { required: "Location is required" })}
                />
                <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
            </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
            <FormControl isInvalid={errors.budget ? true : false}>
                <FormLabel>Budget</FormLabel>
                <Input
                {...register("budget", { required: "Budget is required" })}
                />
                <FormErrorMessage>{errors.budget?.message}</FormErrorMessage>
            </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
            <FormControl isInvalid={errors.startDate ? true : false}>
                <FormLabel>Start Date</FormLabel>
                <Input
                type="date"
                {...register("startDate", { required: "Start Date is required" })}
                />
                <FormErrorMessage>{errors.startDate?.message}</FormErrorMessage>
            </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
            <FormControl isInvalid={errors.endDate ? true : false}>
                <FormLabel>End Date</FormLabel>
                <Input
                type="date"
                {...register("endDate", { required: "End Date is required" })}
                />
                <FormErrorMessage>{errors.endDate?.message}</FormErrorMessage>
            </FormControl>
            </GridItem>
            







          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Tags</FormLabel>
              <VStack spacing={2} align="start">
                {tags.map((tag, index) => (
                  <Box key={index}  p={2} borderRadius="md">
                    <span>{tag}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveTag(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Input id="tag-input" />
                <Button size="sm" onClick={handleAddTag}>
                  Add Tag
                </Button>
              </VStack>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Images</FormLabel>
              <VStack spacing={2} align="start">
                {images.map((image, index) => (
                  <Box key={index}  p={2} borderRadius="md">
                    <Image src={URL.createObjectURL(image)} alt="Trip Image" maxH={100} />
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Button size="sm">Upload Image</Button>
                </div>
              </VStack>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Accommodations</FormLabel>
              <VStack spacing={2} align="start">
                {accommodations.map((accommodation, index) => (
                  <Box key={index}  p={2} borderRadius="md">
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        {...register(`accommodations.${index}.name`, {
                          required: "Name is required",
                        })}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Address</FormLabel>
                      <Input
                        {...register(`accommodations.${index}.address`, {
                          required: "Address is required",
                        })}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Check-In</FormLabel>
                      <Input
                        {...register(`accommodations.${index}.checkIn`, {
                          required: "Check-In is required",
                        })}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Check-Out</FormLabel>
                      <Input
                        {...register(`accommodations.${index}.checkOut`, {
                          required: "Check-Out is required",
                        })}
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveAccommodation(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button size="sm" onClick={handleAddAccommodation}>
                  Add Accommodation
                </Button>
              </VStack>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Activities</FormLabel>
              <Divider />
              <VStack spacing={2} align="start">
                {activities.map((activity, index) => (
                  <Box key={index}  p={2} borderRadius="md" w="100%">

                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input
                            {...register(`activities.${index}.name`, {
                            required: "Name is required",
                            })}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Textarea
                            {...register(`activities.${index}.description`, {
                            required: "Address is required",
                            })}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Location</FormLabel>
                        <Input
                       
                            {...register(`activities.${index}.location`, {
                            required: "Start Time is required",
                            })}
                        />
                    </FormControl>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveActivity(index)}
                    >
                      Remove
                    </Button>
                    <Divider 
                        bg={"black"}
                    />
                  </Box>
                ))}
                <Button size="sm" onClick={handleAddActivity}>
                  Add Activity
                </Button>
              </VStack>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Transportation</FormLabel>
              <VStack spacing={2} align="start">
                {transportation.map((transport, index) => (
                  <Box key={index}  p={2} borderRadius="md">
                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <Input
                        {...register(`transportation.${index}.name`, {
                          required: "Name is required",
                        })}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        {...register(`transportation.${index}.description`, {
                          required: "Description is required",
                        })}
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveTransportation(index)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button size="sm" onClick={handleAddTransportation}>
                  Add Transportation
                </Button>
              </VStack>
            </FormControl>
          </GridItem>
          <GridItem colSpan={2} textAlign="right">
            <Button type="submit" colorScheme="blue" 
                isLoading={isLoading}
            >Submit</Button>
          </GridItem>
        </Grid>
      </form>
    </Box>
  );
};

export default AddTrip;

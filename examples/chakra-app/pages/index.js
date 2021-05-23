import { Box, Button, Checkbox, CheckboxGroup } from "@chakra-ui/react"

export default function Home() {
  return (
    <Box>
      <CheckboxGroup colorScheme="green" defaultValue={["opt1"]}>
        <Checkbox value="opt1">Option 1</Checkbox>
        <Checkbox value="opt2">Option 2</Checkbox>
      </CheckboxGroup>
    <Button
      backgroundColor="hexRGBAColor"
      color="varColor"
    >This button uses variables + rgba for color</Button>
  </Box>
  )
}

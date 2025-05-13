import { MaterialIcons } from "@expo/vector-icons"

export type IconName = React.ComponentProps<typeof MaterialIcons>["name"]

export type BottomData = [
    { icons?: IconName, action: () => void }
]
import { CommonActions } from "@react-navigation/native";

export function resetNavigateTo(navigation: any, routeName: any, params?: any) {
  navigation.dispatch(
    CommonActions.reset({
      index: 1,
      routes: [{name: routeName, params}],
    })
  );
}

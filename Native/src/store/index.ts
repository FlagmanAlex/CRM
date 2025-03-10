import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "./orderSlice";
import orderListReducer from "./orderListSlice";
import orderItemReducer from "./orderItemSlice"
import clientReducer from './clientSlice'


export const store = configureStore({
    reducer: {
        client: clientReducer,
        orders: orderReducer,
        orderList: orderListReducer,
        orderItem: orderItemReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
import { createAsyncThunk, createEntityAdapter, createSlice, isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import { host, port } from "../Default"; // Предполагается, что Default экспортирует host и port
import { IOrderList } from "../../../Interfaces/IOrderList";
import { AppDispatch, RootState } from ".";
import { updateOrderByOrderList } from "./orderSlice";


const server = `${host}:${port}`;

const orderListAdapter = createEntityAdapter<IOrderList, string>({
    selectId: orderList => orderList._id,
    sortComparer: (a, b) => a.orderNum.toString().localeCompare(b.orderNum.toString())
})

const initialState = orderListAdapter.getInitialState({
    status: 'idle' as 'idle'| "loading" | "succeeded" | "failed", // Состояние загрузки
    error: null as string | null, // Сообщение об ошибке
})

interface fetchProps {
    startDate: string
    endDate: string
}

export const fetchOrderLists = createAsyncThunk<IOrderList[], fetchProps, {rejectValue: string}>(
    'orderList/fetchOrderLists',
    async ({ startDate, endDate }: fetchProps, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${server}/api/order/orderLists?startDate=${new Date(startDate).toISOString()}&endDate=${new Date(endDate).toISOString()}`
            );

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IOrderList[] = await response.json();
            return data;
        } catch (error) {
            let errorMessage = "Неизвестная ошибка";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }
            return rejectWithValue(errorMessage);
        }
    }
);

export const updateOrderAndOrderList = createAsyncThunk<
IOrderList, //Возвращаемый тип ( IOrderList )
IOrderList, //Тип входного параметра ( updateOrderList )
{ dispatch: AppDispatch } //Настройка ( тип ошибки )
>(
    'orderList/updateOrderAndOrderList',
    async (orderList, { dispatch }) => {
        dispatch(updateOrderByOrderList(orderList))
        
        return orderList
    }
)


export const deleteOrderList = createAsyncThunk<string, string, {rejectValue: string}>(
    'orderList/deleteOrderList',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/order/${id}`, {
                method: 'DELETE',
            })
            
            if (response.ok) {
                return id
            }

            const errorData = await response.json()
            const errorMessage = errorData.message || `${response.status} ${response.statusText}`;
            
            return rejectWithValue(errorMessage);
            
        } catch (error) {
            let errorMessage = "Неизвестная ошибка";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === "string") {
                errorMessage = error;
            }
            return rejectWithValue(errorMessage);
        }
    }
)

const orderListSlice = createSlice({
    name: 'orderList',
    initialState,
    reducers: {
        addOrderList(state, action: PayloadAction<IOrderList>) {
            orderListAdapter.addOne(state, action.payload)
        },
        updateOrderList(state, action) {
            console.log(action.payload);            
            orderListAdapter.updateOne(state, action.payload)
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderLists.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrderLists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                orderListAdapter.setAll(state, action.payload)
            })
            .addCase(fetchOrderLists.rejected, (state, action) => {
                state.status = 'failed';
                if (isRejectedWithValue(action)) 
                    state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка при получении данных'
                else state.error = 'Неизвестная ошибка';
            })
            .addCase(deleteOrderList.fulfilled, (state, action ) => {
                orderListAdapter.removeOne(state, action.payload)
            })
            .addCase(deleteOrderList.rejected, (state, action) => {
                state.status = 'failed'
                if (isRejectedWithValue(action))
                    state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка удаления'
                else state.error = 'Неизвестная ошибка'
            })
            .addCase(updateOrderAndOrderList.fulfilled, (state, action) => {
                state.status = 'succeeded'
                orderListAdapter.updateOne(state, 
                    {id: action.payload._id!, changes: action.payload})
            })
    },
});

export const { addOrderList } = orderListSlice.actions;
export const { 
    selectAll: selectAllOrderList,
    selectById: selectOrderListById,
} = orderListAdapter.getSelectors((state: RootState) => state.orderList)

export default orderListSlice.reducer;
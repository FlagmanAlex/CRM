import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { host, port } from "../Default";
import { IOrderItem } from "../../../Interfaces/IOrderItem";
import { RootState } from ".";

const server = `${host}:${port}`;

const orderItemAdapter = createEntityAdapter<IOrderItem, string>({
    selectId: orderItem => orderItem._id!,
    // sortComparer: (a, b) => a..toString().localeCompare(b.orderNum.toString())
})

const initialState = orderItemAdapter.getInitialState({
    status: 'idle' as 'idle'| "loading" | "succeeded" | "failed", // Состояние загрузки
    error: null as string | null, // Сообщение об ошибке
})

export const fetchOrderItem = createAsyncThunk<
IOrderItem[], //Возвращаемый тип ( orderItem[] )
string, //Тип входного параметра ( orderId )
{ rejectValue: string } //Настройка ( тип ошибки )
>(
    'orderItem/fetchOrderItem',
    async (id, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/order/items/${id}`)

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IOrderItem[] = await response.json()
            return data
            
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

export const addOrderItem = createAsyncThunk<
    IOrderItem,             //Тип выходного параметра (newOrderItem)
    IOrderItem,             //Тип входного параметра  (OrderItem)
    { rejectValue: string } // (тип ошибки)
>(
    'orderItem/addOrderItem',
    async (newOrderItem, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/order/items`, {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(newOrderItem)
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IOrderItem = await response.json()
            return data

        } catch (error) {
            const errorMessage = error instanceof Error 
            ? error.message 
            : typeof error === "string" 
            ? error 
            : "Неизвестная ошибка"
            return rejectWithValue(errorMessage);            
        }
    }
)


export const updateOrderItem = createAsyncThunk<
    IOrderItem,             //Тип выходного параметра (updatedOrderItem)
    IOrderItem,             //Тип входного параметра  (updateOrderItem)
    { rejectValue: string } // (тип ошибки)
>(
    'orderItem/updateOrderItem',
    async (updateOrderItem, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/order/items/${updateOrderItem._id}`, {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(updateOrderItem)
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IOrderItem = await response.json()
            return data

        } catch (error) {
            const errorMessage = error instanceof Error 
            ? error.message 
            : typeof error === "string" 
            ? error 
            : "Неизвестная ошибка"
            return rejectWithValue(errorMessage);            
        }
    }
)

export const deleteOrderItem = createAsyncThunk<
string, //Возвращаемый тип ( id удаленного объекта )
string, //Тип входного параметра ( orderItemId )
{ rejectValue: string } //Настройка ( тип ошибки )
>(
    'orderItem/deleteOrderItem',
    async (id, { rejectWithValue }) => {
        console.log('Есть вход в orderItem/deleteOrderItem');
        
        try {
            const response = await fetch(`${server}/api/order/items/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            return id
            
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



const orderItemSlice = createSlice({
    name: 'orderItem',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchOrderItem.pending, (state) => {
            state.status = 'loading'
            state.error = null
        })
        .addCase(fetchOrderItem.fulfilled, (state, action) => {
            state.status = 'succeeded'
            orderItemAdapter.setAll(state, action.payload)
        })
        .addCase(fetchOrderItem.rejected, (state, action) => {
            state.status = 'failed'
            
            if (isRejectedWithValue(action)) 
                state.error = typeof action.payload === 'string' ? action.payload : 'Ошибка при получении данных'
            else state.error = 'Неизвестная ошибка';
        })
        .addCase(deleteOrderItem.fulfilled, (state, action) => {
            state.status = 'succeeded'
            orderItemAdapter.removeOne(state, action.payload)
        })
        .addCase(updateOrderItem.fulfilled, (state, action) => {
            state.status = 'succeeded'
            orderItemAdapter.updateOne(state, {id: action.payload._id!, changes: action.payload})
        })
        .addCase(addOrderItem.fulfilled, (state, action) => {
            state.status = 'succeeded'
            orderItemAdapter.addOne(state, action.payload)
        })
    }
})


export const { 
    selectAll: selectAllOrderItem,
    selectById: selectOrderItemById
} = orderItemAdapter.getSelectors((state: RootState) => state.orderItem)

export default orderItemSlice.reducer

const cachedResuts = new Map()

// export const selectOrderItemsByOrderId = (state: RootState, orderId: string) => {
//     const result = selectAllOrderItem(state).filter(orderItem => orderItem.orderId === orderId)
//     cachedResuts.set(orderId, result)
//     return cachedResuts.get(orderId)
// };

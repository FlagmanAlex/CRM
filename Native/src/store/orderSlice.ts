import { createAsyncThunk, createEntityAdapter, createSlice, isRejectedWithValue, PayloadAction } from "@reduxjs/toolkit";
import { host, port } from "../Default"; // Предполагается, что Default экспортирует host и port
import { IOrder } from "../../../Interfaces/IOrder";
import { RootState } from '.'
import { IOrderList } from "../../../Interfaces/IOrderList";

const server = `${host}:${port}`;

const orderAdapter = createEntityAdapter<IOrder, string>({
    selectId: (order) => order._id!,
    sortComparer: (a, b) => a.orderNum.toString().localeCompare(b.orderNum.toString())
})

const initialState = orderAdapter.getInitialState({
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null, // Сообщение об ошибке
})


export const fetchOrders = createAsyncThunk<IOrder[]>(
    'order/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${server}/api/order`);

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IOrder[] = await response.json();
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

export const createOrder = createAsyncThunk<IOrder, void, { rejectValue: string }>(
    'order/createOrder',
    async (_, { rejectWithValue }) => {
        const newOrderTemp: IOrder = {
            orderNum: 0,
            clientId: '67c9bab271286cadd77e7691',
            date: new Date().toISOString(),
            percent: 15,
        }
        try {
            //Получаем из базы следующий за последним номер накладной
            const respOrderNum = await fetch(`${server}/api/order/getOrderNum`)
            const resp = await respOrderNum.json()
            const orderNum: number = resp.orderNum

            // Добавляем номер накладной к шаблону нового документа
            const newOrder: IOrder = { ...newOrderTemp, orderNum: orderNum }
            // //Создаем новый документ в базе и получаем его экземпляр Order ответом
            const response = await fetch(`${server}/api/order/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newOrder)
            })

            if (!response.ok) {
                const errorMessage = `${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: IOrder = await response.json();
            
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

// export const updateOrder = createAsyncThunk<
// IOrder, //Возвращаемый тип ( IOrder )
// IOrder, //Тип входного параметра ( updateOrder )
// { rejectValue: string } //Настройка ( тип ошибки )
// >(
//     'orderList/updateOrderList',
//     async (updateOrder: IOrder, { rejectWithValue }) => {
//         try {
//             if (typeof updateOrder._id !== 'string' || updateOrder._id.trim() === '') {
//                 return rejectWithValue('Некорректный идентификатор заказа')
//             }
//             // Отправляем данные на сервер
//             const response = await fetch(`${server}/api/order/${updateOrder._id}`, {
//                 method: 'PATCH',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify(updateOrder),
//             })
//             const data: IOrder = await response.json();
//             if (response.ok) {
//                 return data
//             }

//             const errorMessage = `${response.status} ${response.statusText}`;
//             throw new Error(errorMessage);

//         } catch (error) {
//             let errorMessage = "Неизвестная ошибка";
//             if (error instanceof Error) {
//                 errorMessage = error.message;
//             } else if (typeof error === "string") {
//                 errorMessage = error;
//             }
//             return rejectWithValue(errorMessage);
//         }
//     }
// )

export const updateOrderByOrderList = createAsyncThunk<
IOrder, //Возвращаемый тип ( IOrder )
IOrderList, //Тип входного параметра ( IOrderList )
{ rejectValue: string } //Настройка ( тип ошибки )
>(
    'orderList/updateOrderByOrderList',
    async (orderList: IOrderList, { rejectWithValue }) => {
        try {
            // Отправляем данные на сервер
            const response = await fetch(`${server}/api/order/${orderList._id}`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(orderList),
            })
            const data: IOrder = await response.json();
            if (response.ok) {
                console.log(data);
                
                return data
            }

            const errorMessage = `${response.status} ${response.statusText}`;
            throw new Error(errorMessage);

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

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrder(state, action) {
            orderAdapter.addOne(state, action.payload )
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                orderAdapter.setAll(state, action.payload)
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = isRejectedWithValue(action) ? 
                action.payload as string : 'Неизвестная ошибка';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded'
                orderAdapter.addOne(state, action.payload)
            }) 
            // .addCase(updateOrder.fulfilled, (state, action) => {
            //     state.status = 'succeeded'
            //     orderAdapter.updateOne(state, {id: action.payload._id!, changes: action.payload})
            // })
            .addCase(updateOrderByOrderList.fulfilled, (state, action) => {
                state.status = 'succeeded'
                orderAdapter.updateOne(state, {id: action.payload._id!, changes: action.payload})
            })
    },
});

export const { 
    selectAll: selectAllOrders, 
    selectById: selectOrderById
} = orderAdapter.getSelectors((state: RootState ) => state.orders)

export default orderSlice.reducer;
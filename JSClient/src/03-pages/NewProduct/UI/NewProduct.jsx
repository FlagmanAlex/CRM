import React, { useState } from 'react';
import { ConfigProvider, Radio, Tabs } from 'antd';
import s from './NewProduct.module.css'
import { FormVitamin } from '../../../04-widgets/FormVitamin';
import { FormParfum } from '../../../04-widgets/FormParfum';


export const NewProduct = () => {
  const [size, setSize] = useState('small');
  const onChange = (e) => {
    setSize(e.target.value);
  };
  return (
    <div className={s.NewProduct}>
      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              margin: 0,
              padding: 0,
            }
          }
        }}
      >
        <Tabs
          defaultActiveKey="1"
          animated={{inkBar: true, tabPane: true}}
          type="card"
          size={size}
          centered
          items={[
            {
              label: <span className={`${s.tabs} ${s.vitamins}`}>Витамины</span>,
              key: 1,
              children: <FormVitamin />,
            },
            {
              label: <span className={`${s.tabs} ${s.parfums}`}>Парфюмерия</span>,
              key: 2,
              children: (<FormParfum />)
            },
            {
              label: <span className={`${s.tabs} ${s.sportpits}`}>Спортпит</span>,
              key: 3,
              children: (<></>)
            },
            {
              label: <span className={`${s.tabs} ${s.cosmetics}`}>Косметика</span>,
              key: 4,
              children: (<></>)
            },

          ]}
        />
      </ConfigProvider>
    </div>
  );
};

// items={new Array(3).fill(null).map((_, i) => {
//   const id = String(i + 1);
//   return {
//     label: `Card Tab ${id}`,
//     key: id,
//     children: `Content of card tab ${id}`,
//   };
// })}

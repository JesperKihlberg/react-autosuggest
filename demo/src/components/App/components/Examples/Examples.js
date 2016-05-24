import styles from './Examples.less';

import React from 'react';
import Basic from 'Basic/Basic';
import MultipleSections from 'MultipleSections/MultipleSections';
import CustomRender from 'CustomRender/CustomRender';
import SubMenus from 'SubMenus/SubMenus';
import CustomInput from 'CustomInput/CustomInput';

export default function Examples() {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        Examples
      </h2>
      <Basic />
      <MultipleSections />
      <CustomRender />
      <SubMenus />
      <CustomInput />
    </div>
  );
};

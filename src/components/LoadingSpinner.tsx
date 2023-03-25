/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";


type Props = {
  isLoading: boolean;
};

const styles = {
  root: css`
    position: absolute;
    z-index: 9999;
    height: 100%;
    width: 100%;
    background-color: #6161ae;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
};


const LoadingSpinner: React.FC<Props> = ({isLoading}) => {
  if (!isLoading) {
    return null;
  }

  

  return <div css={styles.root}>
    Loading assets...
  </div>;
}

export default LoadingSpinner;
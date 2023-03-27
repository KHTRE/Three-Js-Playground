/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../navigation/routes';

type Props = {};

const styles = {
  list: css`
    display: flex;
    flex-direction: column;
    font-size: 24;
    font-weight: 700;
  `,

  link: css`
    color: #0083BF;
    text-decoration: none;

    &:hover {
      color: #00578E;
    }
  `,
}; 

const Main: React.FC<Props> = () => (
  <nav>
    <ul css={styles.list}>
      <NavLink to={ROUTES.Physics} css={styles.link}>Physics</NavLink>
      <NavLink to={ROUTES.Box} css={styles.link}>Box</NavLink>
      <NavLink to={ROUTES.Clock} css={styles.link}>Clock</NavLink>
      <NavLink to={ROUTES.Weather} css={styles.link}>Weather</NavLink>
      <NavLink to={ROUTES.WeatherAsync} css={styles.link}>WeatherAsync</NavLink>
      <NavLink to={ROUTES.Knife} css={styles.link}>Knife</NavLink>
    </ul>
  </nav>  
);

export default Main;
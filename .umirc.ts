import { defineConfig } from 'umi';

export default defineConfig({
  base: '/',
  alias: {
    '@lib': '@/lib',
    '@util': '@/_util',
    '@api': '@/api',
    '@assets': '@/assets',
    '@baseComponents': '@/pages/_baseComponents',
    '@components': '@/pages/_components',
    '@style': '@/pages/_style',
  },
  nodeModulesTransform: {
    type: 'none',
  },
  history: { type: 'hash' },
  routes: [
    {
      path: '/',
      title: '首页',
      component: '../pages/index',
    },
  ],
});

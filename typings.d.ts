declare module '*.css';
declare module '*.less';
declare module '*.json';
declare module 'react-lottie';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(
    props: React.SVGProps<SVGSVGElement>,
  ): React.ReactElement;
  const url: string;
  export default url;
}

import "./jsx";

declare namespace React {
  type ReactNode = any;
  interface FC<P = {}> {
    (props: P & { children?: ReactNode }): ReactNode;
  }
}

declare module "react" {
  export = React;
}

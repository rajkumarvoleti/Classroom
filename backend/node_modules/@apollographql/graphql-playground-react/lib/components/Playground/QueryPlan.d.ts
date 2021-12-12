import * as React from 'react';
export interface Props {
    value: string;
    isQueryPlanSupported: boolean;
}
export declare class QueryPlanViewer extends React.Component<Props, {}> {
    private node;
    private viewer;
    componentDidMount(): void;
    shouldComponentUpdate(nextProps: any): boolean;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    setRef: (ref: any) => void;
    /**
     * Public API for retrieving the CodeMirror instance from this
     * React component.
     */
    getCodeMirror(): any;
    /**
     * Public API for retrieving the DOM client height for this component.
     */
    getClientHeight(): any;
    render(): JSX.Element;
}
export declare const QueryPlan: any;

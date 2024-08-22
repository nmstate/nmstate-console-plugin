import {
  ColaLayout,
  ComponentFactory,
  DefaultEdge,
  Graph,
  GraphComponent,
  Layout,
  LayoutFactory,
  ModelKind,
  nodeDragSourceSpec,
  withDragNode,
  withPanZoom,
  withSelection,
} from '@patternfly/react-topology';

import CustomGroup from '../components/CustomGroup/CustomGroup';
import CustomNode from '../components/CustomNode/CustomNode';

import { GROUP } from './constants';

export const layoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined =>
  new ColaLayout(graph, { layoutOnDrag: false });

export const componentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (type) {
    case GROUP:
      return withDragNode(nodeDragSourceSpec(GROUP))(withSelection()(CustomGroup));
    default:
      switch (kind) {
        case ModelKind.graph:
          return withPanZoom()(GraphComponent);
        case ModelKind.node:
          return withDragNode(nodeDragSourceSpec(ModelKind.node, true, true))(
            withSelection()(CustomNode),
          );
        case ModelKind.edge:
          return DefaultEdge;
        default:
          return undefined;
      }
  }
};

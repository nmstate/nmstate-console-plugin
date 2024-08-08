import {
  ColaLayout,
  ComponentFactory,
  DefaultEdge,
  DragObjectWithType,
  Edge,
  Graph,
  GraphComponent,
  GraphElement,
  groupDropTargetSpec,
  Layout,
  LayoutFactory,
  ModelKind,
  Node,
  nodeDragSourceSpec,
  nodeDropTargetSpec,
  withDndDrop,
  withDragNode,
  withPanZoom,
  withSelection,
  withTargetDrag,
} from '@patternfly/react-topology';

import CustomGroup from '../components/CustomGroup';
import CustomNode from '../components/CustomNode';

import { CONNECTOR_TARGET_DROP, GROUP } from './constants';

export const layoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined =>
  new ColaLayout(graph, { layoutOnDrag: false });

export const componentFactory: ComponentFactory = (kind: ModelKind, type: string) => {
  switch (type) {
    case GROUP:
      return withDndDrop(groupDropTargetSpec)(
        withDragNode(nodeDragSourceSpec(GROUP))(withSelection()(CustomGroup)),
      );
    default:
      switch (kind) {
        case ModelKind.graph:
          return withPanZoom()(GraphComponent);
        case ModelKind.node:
          return withDndDrop(nodeDropTargetSpec([CONNECTOR_TARGET_DROP]))(
            withDragNode(nodeDragSourceSpec(ModelKind.node, true, true))(
              withSelection()(CustomNode),
            ),
          );
        case ModelKind.edge:
          return withTargetDrag<
            DragObjectWithType,
            Node,
            { dragging?: boolean },
            {
              element: GraphElement;
            }
          >({
            item: { type: CONNECTOR_TARGET_DROP },
            begin: (monitor, props) => {
              props.element.raise();
              return props.element;
            },
            drag: (event, monitor, props) => {
              (props.element as Edge).setEndPoint(event.x, event.y);
            },
            end: (dropResult, monitor, props) => {
              if (monitor.didDrop() && dropResult && props) {
                (props.element as Edge).setTarget(dropResult);
              }
              (props.element as Edge).setEndPoint();
            },
            collect: (monitor) => ({
              dragging: monitor.isDragging(),
            }),
          })(DefaultEdge);
        default:
          return undefined;
      }
  }
};

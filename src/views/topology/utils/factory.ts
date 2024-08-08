import {
  ComponentFactory,
  LayoutFactory,
  Graph,
  Layout,
  ColaLayout,
  ModelKind,
  withDndDrop,
  groupDropTargetSpec,
  withDragNode,
  nodeDragSourceSpec,
  withSelection,
  DefaultGroup,
  graphDropTargetSpec,
  withPanZoom,
  GraphComponent,
  nodeDropTargetSpec,
  withTargetDrag,
  DragObjectWithType,
  GraphElement,
  Edge,
  Node,
  DefaultEdge,
} from '@patternfly/react-topology';
import CustomNode from '../components/CustomNode';
import { CONNECTOR_TARGET_DROP } from './constants';

export const layoutFactory: LayoutFactory = (type: string, graph: Graph): Layout | undefined =>
  new ColaLayout(graph);

export const componentFactory: ComponentFactory = (kind: ModelKind, type: string): any => {
  switch (type) {
    case 'group':
      return withDndDrop(groupDropTargetSpec)(
        withDragNode(nodeDragSourceSpec('group'))(withSelection()(DefaultGroup)),
      );
    default:
      switch (kind) {
        case ModelKind.graph:
          return withDndDrop(graphDropTargetSpec())(withPanZoom()(GraphComponent));
        case ModelKind.node:
          return withDndDrop(nodeDropTargetSpec([CONNECTOR_TARGET_DROP]))(
            withDragNode(nodeDragSourceSpec('node', true, true))(CustomNode),
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

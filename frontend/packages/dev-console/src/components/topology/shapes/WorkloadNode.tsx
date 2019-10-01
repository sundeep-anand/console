import * as React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Status, calculateRadius, PodStatus } from '@console/shared';
import { TooltipPosition } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { resourcePathFromModel } from '@console/internal/components/utils';
import { BuildModel } from '@console/internal/models';
import { routeDecoratorIcon } from '../../import/render-utils';
import { NodeProps, WorkloadData } from '../topology-types';
import Decorator from './Decorator';
import BaseNode from './BaseNode';
import KnativeIcon from './KnativeIcon';

const WorkloadNode: React.FC<NodeProps<WorkloadData>> = ({
  data: workload,
  x,
  y,
  size,
  ...others
}) => {
  const { radius, podStatusOuterRadius, podStatusInnerRadius, decoratorRadius } = calculateRadius(
    size,
  );
  const {
    data: {
      donutStatus: { build },
    },
  } = workload;
  const repoIcon = routeDecoratorIcon(workload.data.editUrl, decoratorRadius);

  return (
    <BaseNode
      x={x}
      y={y}
      outerRadius={radius}
      innerRadius={radius * 0.55}
      icon={workload.data.builderImage}
      label={workload.name}
      kind={workload.data.kind}
      {...others}
      attachments={[
        repoIcon && (
          <Decorator
            key="edit"
            x={radius - decoratorRadius * 0.7}
            y={radius - decoratorRadius * 0.7}
            radius={decoratorRadius}
            href={workload.data.editUrl}
            external
            title="Edit Source Code"
            position={TooltipPosition.right}
          >
            <g transform={`translate(-${decoratorRadius / 2}, -${decoratorRadius / 2})`}>
              {repoIcon}
            </g>
          </Decorator>
        ),
        workload.data.url && (
          <Decorator
            key="route"
            x={radius - decoratorRadius * 0.7}
            y={-radius + decoratorRadius * 0.7}
            radius={decoratorRadius}
            href={workload.data.url}
            external
            title="Open URL"
            position={TooltipPosition.right}
          >
            <g transform={`translate(-${decoratorRadius / 2}, -${decoratorRadius / 2})`}>
              <ExternalLinkAltIcon style={{ fontSize: decoratorRadius }} alt="Open URL" />
            </g>
          </Decorator>
        ),
        build && (
          <Link
            key="build"
            to={`${resourcePathFromModel(
              BuildModel,
              build.metadata.name,
              build.metadata.namespace,
            )}/logs`}
            className="odc-decorator__link"
          >
            <Decorator
              x={-radius + decoratorRadius * 0.7}
              y={radius - decoratorRadius * 0.7}
              radius={decoratorRadius}
              title={`${build.metadata.name} ${build.status && build.status.phase}`}
              position={TooltipPosition.left}
            >
              <g transform={`translate(-${decoratorRadius / 2}, -${decoratorRadius / 2})`}>
                <foreignObject
                  width={decoratorRadius}
                  height={decoratorRadius}
                  style={{ fontSize: decoratorRadius }}
                >
                  <Status status={build.status.phase} iconOnly noTooltip />
                </foreignObject>
              </g>
            </Decorator>
          </Link>
        ),
      ]}
    >
      <PodStatus
        x={-size / 2}
        y={-size / 2}
        innerRadius={podStatusInnerRadius}
        outerRadius={podStatusOuterRadius}
        data={workload.data.donutStatus.pods}
        size={size}
      />
      {workload.data.isKnativeResource && (
        <KnativeIcon
          x={-radius * 0.15}
          y={-radius * 0.65}
          width={radius * 0.39}
          height={radius * 0.31}
        />
      )}
    </BaseNode>
  );
};

export default WorkloadNode;

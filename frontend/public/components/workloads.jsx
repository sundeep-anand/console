import React from 'react';

import {Cog, kindObj, LabelList, ResourceLink, resourcePath, Selector} from './utils';

const Header = () => <div className="row co-m-table-grid__head">
  <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">Name</div>
  <div className="col-lg-3 col-md-3 col-sm-5 col-xs-6">Labels</div>
  <div className="col-lg-3 col-md-3 col-sm-4 hidden-xs">Status</div>
  <div className="col-lg-3 col-md-3 hidden-sm hidden-xs">Pod Selector</div>
</div>;

const CogOfKind = ({kind, o}) => {
  const {factory: {Edit, Delete, ModifyLabels, ModifyCount, ModifyPodSelector}} = Cog;
  const options = [ModifyCount, ModifyPodSelector, ModifyLabels, Edit, Delete].map(f => f(kind, o));

  return <Cog options={options} size="small" anchor="left" key={o.metadata.uid} />;
};
CogOfKind.propTypes = {
  kind: React.PropTypes.object.isRequired,
  o: React.PropTypes.object.isRequired
};

const rowOfKind = (kind) => {
  return class rowOfKindComponent extends React.Component {
    shouldComponentUpdate(nextProps) {
      return _.get(this.props.obj, 'metadata.resourceVersion') !== _.get(nextProps.obj, 'metadata.resourceVersion');
    }

    render() {
      const o = this.props.obj;

      return <div className="row co-resource-list__item">
        <div className="col-lg-3 col-md-3 col-sm-3 col-xs-6">
          <CogOfKind o={o} kind={kindObj(kind)} />
          <ResourceLink kind={kind} name={o.metadata.name} namespace={o.metadata.namespace} title={o.metadata.uid} />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-5 col-xs-6">
          <LabelList kind={kind} labels={o.metadata.labels} />
        </div>
        <div className="col-lg-3 col-md-3 col-sm-4 hidden-xs">
          <a href={`${resourcePath(kind, o.metadata.name, o.metadata.namespace)}/pods`} title="pods">
            {o.status.replicas || 0} of {o.spec.replicas} pods
          </a>
        </div>
        <div className="col-lg-3 col-md-3 hidden-sm hidden-xs">
          <Selector selector={o.spec.selector} />
        </div>
      </div>;
    }
  };
};

export {Header, rowOfKind};

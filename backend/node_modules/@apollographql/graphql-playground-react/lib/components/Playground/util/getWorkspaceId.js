"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWorkspaceId = void 0;

function getWorkspaceId(props) {
  var configPathString = props.configPath ? props.configPath + "~" : '';
  var workspaceNameString = props.workspaceName ? props.workspaceName + "~" : '';
  return "" + configPathString + workspaceNameString + props.endpoint;
}

exports.getWorkspaceId = getWorkspaceId;
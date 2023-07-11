import { dump } from 'js-yaml';

import { NodeNetworkConfigurationInterface } from '@types';

export const copyToClipboard = (selectedInterface: NodeNetworkConfigurationInterface) => {
  const el = document.createElement('textarea');
  el.value = dump(selectedInterface);
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const downloadYAML = (selectedInterface: NodeNetworkConfigurationInterface) => {
  const el = document.createElement('a');
  el.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(dump(selectedInterface))}`,
  );
  el.setAttribute('download', 'interface.yaml');
  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

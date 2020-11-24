const jsplumbSetting = {
  connector: ['Flowchart'],
  overlays: [['Arrow', { width: 6, length: 6, location: 1 }]],
  anchor: ['Right', 'Left', 'Top', 'Bottom'],
  endpoint: [
    'Dot',
    {
      height: 10,
      width: 10
    }
  ],
  endpointStyle: {
    fill: 'rgba(255,255,255,0)',
    outlineWidth: 1
  },
  paintStyle: {
    stroke: '#000',
    strokeWidth: 2
  }
};

export { jsplumbSetting };

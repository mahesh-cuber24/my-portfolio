// The Sanlayan internship — the CFARML radar project is the substance of this role,
// so the entry carries the same expandable detail shape the project cards use.
export const experience = [
  {
    id: 'sanlayan',
    title: 'AI/ML Intern',
    org: 'Sanlayan Technologies',
    orgNote: 'Defence Technology Startup',
    location: 'Bangalore, India',
    start: 'Mar 2026',
    end: 'Present',
    blurb:
      'Building CFARML — a pipeline that replaces radar’s manually-configured CFAR detector with a model that picks the best of nine variants per dwell.',
    tags: ['Python', 'PyTorch', 'Radar DSP', 'ONNX', 'C++'],
    metrics: [
      { value: '9', label: 'CFAR variants ranked per dwell' },
      { value: '3', label: 'Silent pipeline bugs found & fixed' },
      { value: '80/20', label: 'Pd / Pfa scoring weight' },
      { value: '30→6', label: 'Model candidates shortlisted' },
    ],
    detail: {
      overview:
        'In a conventional radar signal-processing chain an engineer picks one CFAR (Constant False Alarm Rate) detection algorithm ahead of a mission, and that single choice runs for every dwell — whether the scene is clean open sky, a dense multi-target scenario, or a noisy clutter edge. CFARML trains a neural network to read the Coherent Integration output of each individual dwell and predict which of nine CFAR variants would perform best, then selects and runs it automatically.',
      highlights: [
        'Framed as multi-output regression rather than 9-way classification — predicting a score for every variant preserves the margin between them and yields a full ranking, not just a winner.',
        'Scored each variant against simulator ground truth using Hungarian-algorithm matching with a spatial association gate, weighted 80% probability of detection / 20% false alarm rate.',
        'Narrowly scoped insertion point: pulse compression and coherent integration upstream, and DBSCAN centroiding onward downstream, are completely untouched — the model replaces only the manual CFAR-type decision.',
        'Generated synthetic multi-channel IQ radar data with configurable target, clutter and noise parameters to build the training datasets.',
        'Model build order deliberately escalates from cheap and interpretable to deep: Ridge → Random Forest → CatBoost (MultiRMSE) → shallow MLP → CNN variants → dual-branch fusion.',
      ],
      challenges: [
        {
          title: 'Every variant reported zero probability of detection',
          body: 'The entire labelled dataset was unusable. Rather than guess at a cause, each pipeline component was cleared individually against data — pulse compression matched a MATLAB reference exactly, coherent integration was verified on the Doppler axis, DBSCAN/SLB/Monopulse were confirmed pass-throughs, and chirp files were confirmed byte-identical across capture pipelines. That isolated two independent, confirmed bugs.',
        },
        {
          title: 'A silent CFAR-type substitution',
          body: 'The CFAR type selector was hardcoded to a fixed value inside the core module instead of reading the radar header, so all four trimmed-mean variants were secretly running Trimmed-LOG-CFAR. It failed silently — the pipeline completed and produced plausible output. Only detection-count distribution analysis across variants exposed that four of nine "different" datasets were identical.',
        },
        {
          title: 'A ~69 m range offset killing every association',
          body: 'A capture-convention difference double-counted the range-minimum offset, compounded by a 1-based range-bin index used without its −1 correction. Every reported target landed just outside the association gate, so correct detections scored as complete misses on every dwell. The tell was consistency — misses on every dwell, not sporadically, which rules out noise and points at a systematic geometric offset.',
        },
        {
          title: 'Refusing the convenient fix',
          body: 'When LOG-CFAR started producing 200+ detections per dwell and crashed three downstream scripts, the tempting fix was clamping detection counts. That was rejected: silently truncating one variant’s detections biases its score against the other eight, poisoning the exact comparison the project depends on. The real fix was referencing the correct config key.',
        },
      ],
      stack: [
        'Python',
        'PyTorch',
        'scikit-learn',
        'CatBoost',
        'NumPy',
        'ONNX',
        'C++',
        'Hungarian matching',
      ],
      status:
        'Pipeline correctness confirmed and dataset regeneration under way; ONNX export into the C++ signal-processing chain is scoped as a later phase to meet the radar’s real-time latency budget.',
    },
  },
];

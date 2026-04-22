// ==========================================
// KNOWLEDGE BLOCKS DATA
// Add your blocks to the knowledgeBlocks array.
// Each block needs: slug, title, icon, description, tags, sources
// Then create blocks/{slug}.html and public/resources/{slug}.html
// ==========================================
export const PORTFOLIO_DATA = {
  name: "Knowledge Blocks",

  knowledgeBlocks: [
    {
      slug: 'example',
      title: 'Example Block',
      icon: '📖',
      description: 'A starter knowledge block showing the format — replace with your own topics',
      tags: ['getting-started', 'template'],
      sources: [
        { title: 'Knowledge Blocks GitHub', url: 'https://github.com' }
      ]
    },
    {
      slug: 'docker',
      title: 'Docker',
      icon: '🐳',
      description: 'Container runtime — images, Dockerfiles, volumes, networking, multi-stage builds',
      tags: ['containers', 'devops', 'infrastructure'],
      connections: ['kubernetes', 'ci-cd'],
      sources: [
        { title: 'Docker Docs', url: 'https://docs.docker.com' }
      ]
    },
    {
      slug: 'kubernetes',
      title: 'Kubernetes',
      icon: '☸️',
      description: 'Container orchestration — pods, services, deployments, scaling, Helm charts',
      tags: ['containers', 'devops', 'orchestration'],
      connections: ['docker', 'ci-cd'],
      sources: [
        { title: 'Kubernetes Docs', url: 'https://kubernetes.io/docs' }
      ]
    },
    {
      slug: 'ci-cd',
      title: 'CI/CD Pipelines',
      icon: '🔄',
      description: 'Continuous integration and delivery — GitHub Actions, build stages, deploy strategies',
      tags: ['devops', 'automation', 'pipelines'],
      connections: ['docker', 'kubernetes'],
      sources: [
        { title: 'GitHub Actions Docs', url: 'https://docs.github.com/en/actions' }
      ]
    },
    {
      slug: 'nvidia-cuvslam',
      title: 'NVIDIA cuVSLAM',
      icon: '🟢',
      description: 'GPU-accelerated Visual SLAM — CUDA pipeline, multi-camera support (up to 32), Isaac ROS 2 integration on Jetson',
      tags: ['vslam', 'nvidia', 'gpu', 'cuda', 'ros2', 'jetson'],
      connections: ['orb-slam3', 'mit-kimera', 'bundle-adjustment', 'loop-closure', 'stereo-vision'],
      sources: [
        { title: 'NVIDIA Isaac ROS Visual SLAM', url: 'https://github.com/NVIDIA-ISAAC-ROS/isaac_ros_visual_slam' },
        { title: 'cuVSLAM Documentation', url: 'https://nvidia-isaac-ros.github.io/repositories_and_packages/isaac_ros_visual_slam/index.html' }
      ]
    },
    {
      slug: 'orb-slam3',
      title: 'ORB-SLAM3',
      icon: '🔵',
      description: 'State-of-the-art CPU Visual SLAM — 3-thread architecture, ORB features, atlas multi-map, covisibility graph',
      tags: ['vslam', 'orb', 'cpu', 'slam', 'open-source'],
      connections: ['nvidia-cuvslam', 'mit-kimera', 'visual-features', 'bundle-adjustment', 'loop-closure', 'pose-graph-optimization', 'imu-preintegration'],
      sources: [
        { title: 'ORB-SLAM3 Paper (Campos et al.)', url: 'https://doi.org/10.1109/TRO.2021.3075644' },
        { title: 'ORB-SLAM3 GitHub', url: 'https://github.com/UZ-SLAMLab/ORB_SLAM3' }
      ]
    },
    {
      slug: 'mit-kimera',
      title: 'MIT Kimera',
      icon: '🟣',
      description: 'Modular spatial perception — VIO, robust PGO, 3D mesh reconstruction, semantic mapping, multi-robot SLAM',
      tags: ['vslam', 'kimera', 'semantics', 'mesh', 'multi-robot'],
      connections: ['nvidia-cuvslam', 'orb-slam3', 'dynamic-scene-graphs', 'factor-graphs', 'imu-preintegration', 'semantic-mapping', 'mesh-reconstruction', 'multi-robot-slam', 'robust-optimization'],
      sources: [
        { title: 'Kimera Paper (Rosinol et al.)', url: 'https://doi.org/10.1177/0278364920982603' },
        { title: 'Kimera GitHub (MIT SPARK Lab)', url: 'https://github.com/MIT-SPARK/Kimera' }
      ]
    },
    {
      slug: 'imu-preintegration',
      title: 'IMU Preintegration',
      icon: '⚡',
      description: 'Fusing high-rate inertial data with keyframe-based vision — Forster preintegration theory, bias handling, and VIO applications',
      tags: ['sensor-fusion', 'imu', 'vio', 'state-estimation'],
      connections: ['orb-slam3', 'mit-kimera', 'factor-graphs'],
      sources: [
        { title: 'Forster et al. — On-Manifold Preintegration (TRO 2017)', url: 'https://ieeexplore.ieee.org/document/7557075' },
        { title: 'GTSAM IMU Factor Documentation', url: 'https://gtsam.org/doxygen/a03759.html' }
      ]
    },
    {
      slug: 'factor-graphs',
      title: 'Factor Graphs & GTSAM',
      icon: '🔗',
      description: 'Probabilistic graphical models for SLAM, sensor fusion, and calibration — factor graph theory, GTSAM library, iSAM2 incremental solver',
      tags: ['optimization', 'probabilistic', 'gtsam', 'isam2'],
      connections: ['mit-kimera', 'imu-preintegration', 'bundle-adjustment', 'pose-graph-optimization'],
      sources: [
        { title: 'Factor Graphs for Robot Perception (Dellaert & Kaess)', url: 'https://www.cs.cmu.edu/~kaess/pub/Dellaert17fnt.pdf' },
        { title: 'GTSAM Documentation', url: 'https://gtsam.org' }
      ]
    },
    {
      slug: 'dynamic-scene-graphs',
      title: 'Dynamic Scene Graphs',
      icon: '🏛️',
      description: 'Hierarchical 3D scene representation — metric mesh, objects, places, rooms, buildings, and dynamic agents for semantic queries and task planning',
      tags: ['scene-understanding', 'semantics', 'planning', 'hydra'],
      connections: ['mit-kimera', 'semantic-mapping'],
      sources: [
        { title: '3D Dynamic Scene Graphs (Rosinol et al. RSS 2020)', url: 'https://arxiv.org/abs/2002.06289' },
        { title: 'Hydra: Real-Time 3D Scene Graph Construction', url: 'https://arxiv.org/abs/2201.13360' }
      ]
    },
    {
      slug: 'bundle-adjustment',
      title: 'Bundle Adjustment',
      icon: '🎯',
      description: 'Joint optimization of camera poses and 3D landmarks — reprojection error, Levenberg-Marquardt, Schur complement, local vs global BA',
      tags: ['optimization', 'slam', 'sfm', 'nonlinear'],
      connections: ['pose-graph-optimization', 'factor-graphs', 'stereo-vision', 'loop-closure', 'nvidia-cuvslam', 'orb-slam3'],
      sources: [
        { title: 'Bundle Adjustment — A Modern Synthesis (Triggs et al.)', url: 'https://link.springer.com/chapter/10.1007/3-540-44480-7_21' },
        { title: 'g2o: A General Framework for Graph Optimization', url: 'https://github.com/RainerKuemmerle/g2o' }
      ]
    },
    {
      slug: 'loop-closure',
      title: 'Loop Closure & Place Recognition',
      icon: '🔄',
      description: 'Detecting revisited places to correct SLAM drift — Bag of Words, DBoW2, geometric verification, and correction propagation',
      tags: ['slam', 'place-recognition', 'bow', 'drift'],
      connections: ['bundle-adjustment', 'pose-graph-optimization', 'visual-features', 'robust-optimization'],
      sources: [
        { title: 'DBoW2: Bags of Binary Words for Fast Place Recognition', url: 'https://doi.org/10.1109/TRO.2012.2197158' }
      ]
    },
    {
      slug: 'visual-features',
      title: 'Visual Features',
      icon: '👁️',
      description: 'Feature detection, description, and matching for SLAM — ORB, FAST, BRIEF, KLT optical flow, Shi-Tomasi corners',
      tags: ['computer-vision', 'features', 'orb', 'klt'],
      connections: ['loop-closure', 'stereo-vision', 'orb-slam3'],
      sources: [
        { title: 'ORB Feature Paper (Rublee et al.)', url: 'https://doi.org/10.1109/ICCV.2011.6126544' },
        { title: 'Lucas-Kanade 20 Years On (Baker & Matthews)', url: 'https://www.ri.cmu.edu/pub_files/pub3/baker_simon_2002_3/baker_simon_2002_3.pdf' }
      ]
    },
    {
      slug: 'pose-graph-optimization',
      title: 'Pose Graph Optimization',
      icon: '📊',
      description: 'Optimizing robot trajectories as a graph — nodes as poses, edges as constraints, faster than full bundle adjustment',
      tags: ['optimization', 'slam', 'graph', 'poses'],
      connections: ['bundle-adjustment', 'factor-graphs', 'loop-closure', 'robust-optimization'],
      sources: [
        { title: 'A Tutorial on Graph-Based SLAM (Grisetti et al.)', url: 'https://doi.org/10.1109/MITS.2010.939925' }
      ]
    },
    {
      slug: 'semantic-mapping',
      title: '3D Semantic Mapping',
      icon: '🗺️',
      description: 'Projecting 2D semantic labels into 3D volumes — TSDF integration, Voxblox, Bayesian label fusion for per-voxel semantics',
      tags: ['semantics', 'tsdf', 'voxblox', 'segmentation'],
      connections: ['mit-kimera', 'dynamic-scene-graphs', 'mesh-reconstruction'],
      sources: [
        { title: 'Kimera-Semantics', url: 'https://github.com/MIT-SPARK/Kimera-Semantics' },
        { title: 'Voxblox (Oleynikova et al.)', url: 'https://github.com/ethz-asl/voxblox' }
      ]
    },
    {
      slug: 'mesh-reconstruction',
      title: '3D Mesh Reconstruction',
      icon: '🔺',
      description: 'Real-time dense surface reconstruction — Delaunay triangulation, marching cubes, Kimera-Mesher, nvblox',
      tags: ['mesh', 'delaunay', 'dense', 'nvblox'],
      connections: ['mit-kimera', 'semantic-mapping', 'stereo-vision'],
      sources: [
        { title: 'Kimera-Mesher', url: 'https://github.com/MIT-SPARK/Kimera-Mesher' },
        { title: 'nvblox', url: 'https://github.com/nvidia-isaac/nvblox' }
      ]
    },
    {
      slug: 'multi-robot-slam',
      title: 'Multi-Robot SLAM',
      icon: '🤖',
      description: 'Distributed multi-robot mapping — centralized vs distributed architectures, inter-robot loop closure, Kimera-Multi',
      tags: ['multi-robot', 'distributed', 'collaboration'],
      connections: ['mit-kimera', 'robust-optimization', 'loop-closure'],
      sources: [
        { title: 'Kimera-Multi (Tian et al. T-RO 2022)', url: 'https://arxiv.org/abs/2106.14386' }
      ]
    },
    {
      slug: 'stereo-vision',
      title: 'Stereo Vision & Triangulation',
      icon: '📐',
      description: 'Depth from cameras — stereo geometry, disparity maps, epipolar constraints, monocular triangulation, RGB-D sensors',
      tags: ['depth', 'stereo', 'triangulation', 'epipolar'],
      connections: ['visual-features', 'bundle-adjustment', 'mesh-reconstruction'],
      sources: [
        { title: 'Multiple View Geometry in Computer Vision (Hartley & Zisserman)', url: 'https://www.robots.ox.ac.uk/~vgg/hzbook/' }
      ]
    },
    {
      slug: 'robust-optimization',
      title: 'Robust Optimization',
      icon: '🛡️',
      description: 'Handling outliers in SLAM optimization — robust cost functions, Graduated Non-Convexity (GNC), Pairwise Consistency Maximization (PCM)',
      tags: ['outlier-rejection', 'gnc', 'pcm', 'robust'],
      connections: ['mit-kimera', 'pose-graph-optimization', 'loop-closure', 'multi-robot-slam'],
      sources: [
        { title: 'Graduated Non-Convexity (Yang et al.)', url: 'https://arxiv.org/abs/1909.08605' },
        { title: 'Kimera-RPGO', url: 'https://github.com/MIT-SPARK/Kimera-RPGO' }
      ]
    }
  ]
};

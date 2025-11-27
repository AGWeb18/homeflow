import { User, Project, Task, Milestone, Contractor } from '../types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Sarah',
  email: 'sarah@example.com',
  avatar_url: 'https://ui-avatars.com/api/?name=Sarah&background=0D8ABC&color=fff'
};

export const MOCK_PROJECT: Project = {
  id: 'p1',
  user_id: 'u1',
  name: '123 Maple Street Addition',
  address: '123 Maple Street, Springfield',
  status: 'Permitting',
  progress: 45
};

export const MOCK_TASKS: Task[] = [
  { id: 't1', project_id: 'p1', title: 'Sign structural engineering contract', due_date: '2024-10-26', completed: false },
  { id: 't2', project_id: 'p1', title: 'Submit plans to city planning department', due_date: '2024-10-15', completed: true },
  { id: 't3', project_id: 'p1', title: 'Finalize kitchen cabinet selection', due_date: '2024-11-05', completed: false },
];

export const MOCK_MILESTONES: Milestone[] = [
  { id: 'm1', project_id: 'p1', title: 'Initial Design Approved', date: '2024-08-01', status: 'Completed' },
  { id: 'm2', project_id: 'p1', title: 'Permits Submitted', date: '2024-09-20', status: 'Completed' },
  { id: 'm3', project_id: 'p1', title: 'Construction Begins', date: '2024-12-01', status: 'Pending' },
  { id: 'm4', project_id: 'p1', title: 'Final Inspection', date: '2025-04-15', status: 'Upcoming' },
];

export const MOCK_TEAM: Contractor[] = [
    {
        id: 'c1',
        name: 'John Architect',
        role: 'Architect',
        rating: 4.8,
        reviews: 12,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRM1psBYPXzx4ob-gETavFs-ubyzgR0oYCOMEJ_tPIGI_p0dRViCifcD2kGf5EPxeyIQZgEm5uSoXeFjvXVXOvGj_sIMMdOX9gJy0sCjm7XG0FS2GySp5hNX_iZfW9JseyYToK43JursqvyKyRkxpyA9-oxw_eJoHh8ObHkZKcyqb7v7SoK0uFJenC-IkCQdL_dlaUfAVASC7FvWJjWo3ziWDa0vUHD5cmmP-KYW_6vrmUY4SqaG2rlKvU0wy0CqzGlF4Evp5Y4GI',
        verified: true,
        specialist: true,
        licensed: true
    },
    {
        id: 'c2',
        name: 'Mike Contractor',
        role: 'Contractor',
        rating: 4.5,
        reviews: 8,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8ntUPiZqUujERup1-iX_Ynp5R1bOW2KIcVhKo0hMDB79IcpJmlCnBMZ5cU4Y2JWWO4PG2wud7piy7nN8-xVIF5ufT3br-Eb3aMbuBebv5_9mwfoI7UtgoJjafiFWD4xT4wHLWPxBgpmyclbRJj2QCpWsP8f0o0VgRoKkciQtlCg6CHrXm6nsQQBlAPQ0ajGTveYr91opBTqD-Az05gvsd35ppdjLO92df86AeJOW5u1d3Xrn1oD_4kiT2Q2PYXkmRmSjcjHSB7Gw',
        verified: true,
        specialist: false,
        licensed: true
    }
];

export const MOCK_CONTRACTORS_DIRECTORY: Contractor[] = [
    {
      id: '1',
      name: 'BuildCo Construction',
      role: 'General Contractor',
      rating: 4.9,
      reviews: 42,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqrMO1LCefEj7r1HEJKPbxETUHU9sTi4vurRjPVNctM32032NxBbMB4WVGak4U2M2ww7nGeNFsG8cwzN5yoX-1kreJRktUizNQMkN5iPGjc9_8aYaD1TQFVZQjaCgJemtWjlSM6TIIJ0s_HGlfv6wvxMDsjsjL-6L2YvnSJSST0ESv4TWWR_hzcAK3Cvok8to5a9kchR3wDjvFPqLNIQJyzMYVD3NBb7VK7GD7ZQA2Q4jb6Lu1nsnucTUUT78S-VnZH0AW8cpIUMU',
      verified: true,
      specialist: true,
      licensed: true
    },
    {
      id: '2',
      name: 'ArcDesign Studio',
      role: 'Architect',
      rating: 5.0,
      reviews: 18,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt2F6zWjZFEV-2DhKgOW4IANZjVCcu97L7rXygODmI_2H0qoQedTGAQPjlCDHaWBORZ_RhfLzOkrJL_7ZrbNfnd0BTamYgWnEzPnHmSrHc6_VL43AITDJbBlryRMFhnu1Tiu7Xz09lSSgAWaWuLqsQs9RoS_sKiQxOl86ICpj4Y9l9v6ehf7vo5FlvZMsY4HRXcRKHZF9uQE1XRoL8R1NhMDaibzpzmbH6J7V_yjH_bLcM_Yt2I12RDus1mve7rl019jLXlQ40dj0',
      verified: true,
      specialist: true,
      licensed: false
    },
    {
      id: '3',
      name: 'Precision Plumbing',
      role: 'Plumber',
      rating: 4.7,
      reviews: 31,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5XX1zPEtvfwqPGUnvFLDI3m300JDQzHlu5lpz7rDNavPMIz12VW4dylUKqW3PhvuDMiDLc70zQCDlqF_8ZvOqe3zYwfCyLoGB0gDKZxtrGzzpa_RUO_87v1Ei86tCQ22khwykoJR7klWxRsym9gkiOVUbOFIBHjcK0wJGjI6Ap6zDNyi3eU9M5dzIgRdRWy_bjEH0TA8qACDpfCKWU1TTdH24SFAhrkCNzaSb0ecp7TucX2AHOQ_B1XE68t5H9l1MDmOsinvcEfA',
      verified: false,
      specialist: false,
      licensed: true
    }
];

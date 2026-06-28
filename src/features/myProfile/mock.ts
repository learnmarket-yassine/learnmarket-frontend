import { TutorProfile } from './store/types'

export const MOCK_PROFILE: TutorProfile = {
  id: '1',
  name: 'Amine Ben Khaled',
  isVerified: true,
  location: 'Monastir, Tunisia',
  localTime: '7:30 pm local time',
  avatarUrl: undefined,
  headline: 'UX/UI Design Mentor – Helping Learners Build Real-World Skills',
  hourlyRate: 15,
  bio: `I create engaging user experiences and striking visual designs that captivate and convert. With two years of focused experience in UX/UI design, I specialize in crafting clean, user-friendly interfaces that prioritize functionality and aesthetic appeal. I have a strong background in branding and editorial design, allowing me to blend visual storytelling with practical usability. My skills extend to editing visual content and motion for diverse digital platforms, ensuring that every aspect of a project aligns with your vision. I believe in sharing insights and tips to elevate creative collaboration, making me an ideal partner for freelancers and businesses alike. If you're looking for a designer who can enhance your project with impactful visuals and intuitive designs, let's connect to discuss your needs.`,
  connects: 0,
  hoursPerWeek: 'More than 30 hrs/week',
  languages: [
    { name: 'English', level: 'Conversational' },
    { name: 'Arabic', level: 'Native or bilingual' },
    { name: 'French', level: 'Conversational' },
  ],
  education: [
    {
      institution: 'Institut Supérieure de Beaux-Arts de Sousse',
      degree: 'Bachelor degree',
      period: '2021 – 2024',
    },
  ],
  skills: [
    { id: '1', label: 'User Experience' },
    { id: '2', label: 'User Interface Design' },
  ],
  portfolio: [],
  testimonials: [],
  certifications: [],
  employment: [
    {
      id: '1',
      title: 'UX/UI Designer',
      company: 'Sastec',
      period: 'January 2025 – Present',
      description:
        'Since January 2023, I have been working as a UX/UI Designer at Sastec, where I am currently gaining professional, real-world experience in product and interface design. This role has allowed me to grow significantly as a designer by working closely with teams, clients, and developers on real digital products. I have contributed to multiple projects including Connectiflex, Profex, C-Clone, DevFactory Studio, and others, where I was involved in designing user interfaces, improving user experience flows, and supporting product development from concept to execution. This experience has strengthened my skills in UX thinking, UI design systems, collaboration, and client communication, while giving me exposure to real business and product challenges.',
    },
    {
      id: '2',
      title: 'UI Designer',
      company: 'Proxym',
      period: 'February 2024 – December 2025',
      description:
        'I completed a three-month end-of-studies internship at Proxym IT, returning to the same company due to their trust in my potential and performance during my first internship. This experience was a major step in my professional growth. During this internship, I worked on a variety of projects involving UX/UI design, branding, and video editing, allowing me to develop a multidisciplinary design skill set combined to resilient-oriented tasks and collaborative team projects, gaining hands-on experience in both creative and technical aspects of design. This internship concluded with my final university presentation on (soutenance), where I achieved a high distinction score of 17.5/20, reflecting the quality of my work and the strength of my final project.',
    },
  ],
  completedJobs: 818,
  inProgressJobs: 11,
}

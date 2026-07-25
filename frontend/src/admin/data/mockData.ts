// ============================================================================
// SkillUp Academy Check-In Portal — Mock Data Seed
// ============================================================================
export const mockActivityLog: any[] = [
  { id: 'act-001', userId: 'usr-003', userName: 'Grace Solomon', action: 'Child Checked In', entity: 'Child', entityId: 'c-001', description: 'Checked in Jayden Okonkwo at Raji Rasaki Centre', timestamp: new Date().toISOString(), previousValue: 'checked_out', newValue: 'checked_in' },
  { id: 'act-002', userId: 'usr-001', userName: 'Christiana Okokon', action: 'System Config Updated', entity: 'Setting', entityId: 'set-001', description: 'Updated global check-in PIN requirement', timestamp: new Date().toISOString(), previousValue: 'optional', newValue: 'enforced' },
]

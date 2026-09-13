import React from 'react';

interface SkillsSectionProps {
  skills: {
    name: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    isVerified?: boolean;
  }[];
  onAdd?: () => void;
  onRemove?: (skillId: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  onAdd,
  onRemove,
}) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert':
        return 'bg-green-500';
      case 'advanced':
        return 'bg-blue-500';
      case 'intermediate':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelText = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Skills
        </h3>
        {onAdd && (
          <button
            onClick={onAdd}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            + Add Skill
          </button>
        )}
      </div>

      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900 dark:text-white">
                {skill.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {skill.category}
              </span>
              <span
                className={`px-2 py-0.5 text-white text-xs rounded-full ${getLevelColor(skill.level)}`}
              >
                {getLevelText(skill.level)}
              </span>
              {skill.isVerified && (
                <span className="text-xs text-green-500 font-medium">✓ Verified</span>
              )}
            </div>

            {onRemove && (
              <button
                onClick={() => onRemove(skill.id)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        {skills.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No skills added yet
          </p>
        )}
      </div>
    </div>
  );
};

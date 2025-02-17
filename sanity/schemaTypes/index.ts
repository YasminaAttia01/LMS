import { type SchemaTypeDefinition } from 'sanity'
import { courseType } from './courseType'
import { lessonType } from './lessonType'
import { categoryType } from './categoryType'
import { instructorType } from './instructorType'
import { moduleType } from './moduleType'
import { blockContent } from './blockContent'
import { lessonCompletionType } from './lessonCompletionType'
import { studentType } from './studentType'
import { enrollmentType } from './enrollementType'


export const schema: { types: SchemaTypeDefinition[] } = {
  types: [studentType,courseType,moduleType,lessonType,instructorType,blockContent,enrollmentType,categoryType,lessonCompletionType,],
}

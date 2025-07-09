import { exec } from 'child_process'
import { writeFileSync } from 'fs'

exec(
  'npx supabase gen types typescript --project-id emvtmcaetscmmdcqhpae --schema public',
  (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error generating types:', stderr)
      process.exit(1)
    } else {
      writeFileSync('src/types/supabase.ts', stdout)
      console.log('✅ Supabase types generated successfully!')
    }
  },
)

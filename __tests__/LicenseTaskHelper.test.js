import moment from 'moment';
import {syncTasksDataWithLicense, syncBucketTasksWithLicense} from '../src/Utils/Helpers/LicenseTaskHelper';

const license = days => ({state_id: 2, state_name: 'Alabama', to_date: moment().add(days, 'days').format('YYYY-MM-DD')});
const course = {title: 'Course', button_display_text: 'Resume'};
const stale = {due_in_30_days: [{title: 'Other state', button_display_text: 'Update'}, course]};

test.each([[30,'due_in_30_days'],[31,'due_in_60_days'],[60,'due_in_60_days'],[61,'due_in_90_days'],[90,'due_in_90_days']])('expiry at %s days appears only in %s', (days, bucket) => {
 const result = syncTasksDataWithLicense(stale, license(days));
 expect(result[bucket]).toContainEqual(expect.objectContaining({title:'Alabama', button_display_text:'Update'}));
 expect(Object.values(result).flat().filter(item=>item.button_display_text==='Update')).toHaveLength(1);
 expect(result.due_in_30_days).toContain(course);
});
test('renewing above 90 days removes stale renewal in dashboard and tasks without removing courses', () => {
 const result = syncTasksDataWithLicense(stale, license(91));
 expect(Object.values(result).flat()).toEqual([course]);
 expect(syncBucketTasksWithLicense(stale.due_in_30_days,license(91),'Alabama','due_in_30_days')).toEqual([course]);
});

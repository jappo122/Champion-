const BASE = 'https://www.championsalestrainingandevents.com';

const pages = [
  '/', '/login', '/signup', '/blog', '/blog/10-step-automotive-sales-process',
  '/blog/top-7-objections-car-sales', '/blog/reduce-dealership-sales-turnover-training',
  '/blog/morning-routine-top-car-salesperson', '/blog/closing-techniques-every-car-salesperson',
  '/blog/microlearning-sales-training-modules', '/blog/handle-price-objections-car-sales',
  '/blog/build-customer-trust-car-salesperson', '/blog/car-sales-follow-up-secret',
  '/blog/advanced-closing-techniques-car-sales', '/blog/dealership-sales-training-program-guide',
  '/training', '/training/10-steps-to-the-sale', '/training/10-steps-part2',
  '/training/advanced-closing', '/training/advanced-closing-part2',
  '/training/digital-marketing', '/training/customer-experience', '/training/sales-drills',
  '/training/senior-sales', '/training/closing-objections', '/training/needs-assessment-2',
  '/training/heart-method', '/contact', '/support',
];

async function test() {
  let pass = 0;
  let fail = 0;
  
  console.log('Testing ' + pages.length + ' pages...\n');
  
  for (const page of pages) {
    try {
      const res = await fetch(BASE + page, { signal: AbortSignal.timeout(15000) });
      const text = await res.text();
      const hasContent = text.length > 500;
      const hasError = text.includes('INTERNAL_SERVER_ERROR') || text.includes('Something went wrong');
      const has404 = text.includes('Page not found') && text.length < 10000;
      
      const ok = res.status === 200 && hasContent && (!hasError) && (!has404);
      
      if (ok) {
        pass++;
        console.log('  OK  ' + page + ' (' + text.length + ' bytes)');
      } else {
        fail++;
        let reason = '';
        if (res.status !== 200) reason = 'HTTP ' + res.status;
        else if (text.length <= 500) reason = 'Small (' + text.length + ' bytes)';
        else if (hasError) reason = 'Error text';
        else if (has404) reason = 'Not found';
        console.log(' FAIL ' + page + ' - ' + reason);
      }
    } catch(e) {
      fail++;
      console.log(' FAIL ' + page + ' - ' + (e.message?.slice(0,60) || 'crash'));
    }
  }
  
  console.log('\n=== RESULT: ' + pass + '/' + pages.length + ' OK, ' + fail + ' failed ===');
}

test();

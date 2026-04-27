// src/components/Features.jsx
export default function Features() {
  return (
    <section className="py-10 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-0 lg:grid-cols-4 lg:divide-x divide-gray-200">
          <article className="flex flex-col items-center text-center px-5">
            <svg className="mb-9" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M28.3334 23V7.3L22.1667 12.2594L16.0001 5.33334L9.83341 12.2594L3.66675 7.3V23C3.66675 24.1046 4.56218 25 5.66675 25H26.3334C27.438 25 28.3334 24.1046 28.3334 23Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <h3 className="text-gray-700 font-medium text-xl mb-2">Premium Quality</h3>
            <p className="text-base text-gray-600">Built to deliver reliable and long-lasting durability.</p>
          </article>
          <article className="flex flex-col items-center text-center px-5">
            <svg className="mb-9" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M18.6667 24V8C18.6667 7.29276 18.3858 6.61448 17.8857 6.11438C17.3856 5.61429 16.7073 5.33334 16.0001 5.33334H5.33341C4.62617 5.33334 3.94789 5.61429 3.4478 6.11438C2.9477 6.61448 2.66675 7.29276 2.66675 8V22.6667C2.66675 23.0203 2.80722 23.3594 3.05727 23.6095C3.30732 23.8595 3.64646 24 4.00008 24H6.66675" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M20 24H12" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M25.3334 24H28.0001C28.3537 24 28.6928 23.8595 28.9429 23.6095C29.1929 23.3594 29.3334 23.0203 29.3334 22.6667V17.8C29.3329 17.4974 29.2294 17.204 29.0401 16.968L24.4001 11.168C24.2754 11.0118 24.1172 10.8857 23.9372 10.7989C23.7571 10.7122 23.5599 10.6669 23.3601 10.6667H18.6667" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M22.6667 26.6667C24.1394 26.6667 25.3333 25.4728 25.3333 24C25.3333 22.5272 24.1394 21.3333 22.6667 21.3333C21.1939 21.3333 20 22.5272 20 24C20 25.4728 21.1939 26.6667 22.6667 26.6667Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M9.33341 26.6667C10.8062 26.6667 12.0001 25.4728 12.0001 24C12.0001 22.5272 10.8062 21.3333 9.33341 21.3333C7.86066 21.3333 6.66675 22.5272 6.66675 24C6.66675 25.4728 7.86066 26.6667 9.33341 26.6667Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <h3 className="text-gray-700 font-medium text-xl mb-2">Fast Shipping</h3>
            <p className="text-base text-gray-600">Quick and secure delivery, wherever you are.</p>
          </article>
          <article className="flex flex-col items-center text-center px-5">
            <svg className="mb-9" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M28 16C28 18.3734 27.2962 20.6935 25.9776 22.6668C24.6591 24.6402 22.7849 26.1783 20.5922 27.0866C18.3995 27.9948 15.9867 28.2324 13.6589 27.7694C11.3312 27.3064 9.19295 26.1635 7.51472 24.4853C5.83649 22.8071 4.6936 20.6689 4.23058 18.3411C3.76756 16.0133 4.0052 13.6005 4.91345 11.4078C5.8217 9.21509 7.35977 7.34094 9.33316 6.02236C11.3066 4.70379 13.6266 4 16 4C19.36 4 22.5733 5.33333 24.9867 7.65333L28 10.6667" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M27.9999 4V10.6667H21.3333" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <h3 className="text-gray-700 font-medium text-xl mb-2">Easy Returns</h3>
            <p className="text-base text-gray-600">30-day hassle-free exchange and refund.</p>
          </article>
          <article className="flex flex-col items-center text-center px-5">
            <svg className="mb-9" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M19.9277 12.3256L14.5785 17.6747L11.9897 15.0859M15.9586 28.3333C18.1913 28.3333 22.8147 24.5596 24.9243 21.9493C26.1021 20.4921 26.6764 18.6595 26.6764 16.7857L26.6763 9.49896C26.6763 8.71635 26.2198 8.00564 25.5081 7.68016L16.7902 4.04705C16.262 3.80549 15.6549 3.80549 15.1267 4.04705L6.49196 7.53725C5.78021 7.86274 5.32372 8.57347 5.32373 9.35611L5.32383 16.643C5.32386 18.5166 5.89812 20.3491 7.07587 21.8063C9.18555 24.4166 13.7259 28.3333 15.9586 28.3333Z" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <h3 className="text-gray-700 font-medium text-xl mb-2">Secure Checkout</h3>
            <p className="text-base text-gray-600">Protected payments with warranty-backed purchases.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
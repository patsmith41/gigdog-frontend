import React from 'react';
import Image from 'next/image';

const InsideTheFestEats = () => {
  return (
    <>
      <p>
        Shaky Knees consistently delivers one of the best food lineups of any festival. 
        From classic festival fare to Atlanta's best local food trucks, there's something for everyone.
      </p>
      <figure>
        <Image
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1200&auto-format&fit=crop"
          alt="A delicious looking pizza on a wooden board."
          width={1200} height={800}
          className="rounded-lg"
        />
        <figcaption>Look for vendors like PizzeRizzo for a perfect slice.</figcaption>
      </figure>
      <h3>Don't Miss These Vendors:</h3>
      <ul>
        <li><strong>King of Pops:</strong> A must-have for cooling down on a hot day.</li>
        <li><strong>Island Noodles:</strong> A festival staple for a reason. Hearty and delicious.</li>
        <li><strong>Roti Rolls:</strong> Unique and flavorful Indian-inspired wraps.</li>
      </ul>
    </>
  );
};
export default InsideTheFestEats;
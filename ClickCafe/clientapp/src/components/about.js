import React from "react";

export default function About() {
  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", lineHeight: 1.6 }}>
      < h2 > About ClickCafe ☕</h2>

      <p>
        <strong>ClickCafe</strong> lets you order coffee ahead of time from any
        partner café and pick it up the moment it’s ready—no queue, no rush.
        Choose your drink, pay online or select cash, and we’ll ping you when
        it’s waiting on the counter.
      </p>

      < div style ={
    {
    display: "flex", gap: "1.5rem", margin: "2rem 0", flexWrap: "wrap"
      }
}>
        < img
          src = "barista.jpeg"  
          alt = "Barista handing a takeaway coffee"
          style ={ { flex: "1 1 280px", maxWidth: 400, width: "100%", borderRadius: 8 } }
        />
        < img
          src = "customer.jpeg"
          alt = "Customer enjoying coffee to go"
          style ={ { flex: "1 1 280px", maxWidth: 400, width: "100%", borderRadius: 8 } }
        />
      </ div >

      < h3 > Why you’ll love it</h3>
      <ul>
        <li><strong>Skip the line.</strong> Order from your phone and walk straight to pickup.</li>
        <li><strong>Beat peak hours.</strong> Schedule ahead or grab it ASAP—your choice.</li>
        <li><strong>Cash or card.</strong> Flexible payment, no awkward delays at the till.</li>
        <li><strong>Track &amp; re - order.</ strong > Your favourites are saved for one-tap repeat orders.</li>
      </ul>

      <p style={{ marginTop: "2rem" }}>
        Whether you’re racing to lectures, catching a train or just avoiding the
        morning crowd, ClickCafe keeps the caffeine flowing without the wait.
        Drink in hand, life in motion—cheers! ☕🚀
      </p>
    </div>
  );
}

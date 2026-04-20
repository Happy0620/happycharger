import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";

export default function RestaurantDetails() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [funFactPopup, setFunFactPopup] = useState<{ fact: string; x: number; y: number } | null>(null);
  const [cartToast, setCartToast] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewAvg, setReviewAvg] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const { addToCart, user, token } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resData, menuData] = await Promise.all([
          fetch(`/api/restaurants/${id}`).then(r => r.json()),
          fetch(`/api/menu/restaurant/${id}`).then(r => r.json()),
        ]);
        setRestaurant(resData);
        setMenu(menuData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const data = await fetch(`/api/reviews/${id}`).then(r => r.json());
      setReviews(data.reviews || []);
      setReviewAvg(data.average || 0);
      setReviewCount(data.count || 0);
    } catch {}
  };

  useEffect(() => { if (id) fetchReviews(); }, [id]);

  useEffect(() => {
    if (!funFactPopup) return;
    const t = setTimeout(() => setFunFactPopup(null), 4000);
    return () => clearTimeout(t);
  }, [funFactPopup]);

  useEffect(() => {
    if (!cartToast) return;
    const t = setTimeout(() => setCartToast(null), 2500);
    return () => clearTimeout(t);
  }, [cartToast]);

  const handleAddToCart = (item: any) => {
    addToCart({ menuItemId: item._id, name: item.name, price: item.price, quantity: 1, restaurantId: restaurant._id });
    setCartToast(item.name);
  };

  const showFunFact = (e: React.MouseEvent, fact: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFunFactPopup({ fact, x: rect.left + window.scrollX, y: rect.top + window.scrollY });
  };

  const submitReview = async () => {
    if (!user) { setSubmitMsg("Please log in to leave a review."); return; }
    if (!myRating) { setSubmitMsg("Please select a star rating."); return; }
    if (!myComment.trim()) { setSubmitMsg("Please write a comment."); return; }
    setSubmitting(true);
    setSubmitMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ restaurantId: id, userId: user.id, userName: user.name, rating: myRating, comment: myComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitMsg("Review submitted!");
        setMyComment("");
        setMyRating(0);
        fetchReviews();
      } else {
        setSubmitMsg(data.message || "Error submitting");
      }
    } catch {
      setSubmitMsg("Network error");
    }
    setSubmitting(false);
  };

  const deleteReview = async (reviewId: string) => {
    await fetch(`/api/reviews/${reviewId}`, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
    fetchReviews();
  };

  const renderStars = (count: number, interactive = false, size = "1rem") => (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <i
          key={i}
          className={i <= (interactive ? (hoverRating || myRating) : count) ? "fa-solid fa-star" : "fa-regular fa-star"}
          style={{ color: i <= (interactive ? (hoverRating || myRating) : count) ? "#F59E0B" : "#ddd", fontSize: size, cursor: interactive ? "pointer" : "default", transition: "color 0.1s" }}
          onMouseEnter={() => interactive && setHoverRating(i)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && setMyRating(i)}
        />
      ))}
    </span>
  );

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading...</div>;
  if (!restaurant) return <div style={{ textAlign: "center", padding: "40px" }}>Restaurant not found</div>;

  const existingReview = user ? reviews.find((r: any) => r.userId === user.id || r.userId?._id === user.id) : null;

  return (
    <>
      <div style={{ position: "fixed", bottom: 28, left: "50%", transform: cartToast ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(100px)", background: "#1a1a1a", color: "white", padding: "14px 24px", borderRadius: 40, fontWeight: 600, fontSize: "0.9rem", zIndex: 9999, transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.25)", pointerEvents: "none", whiteSpace: "nowrap" }}>
        <span style={{ background: "#22C55E", borderRadius: "50%", width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem" }}>✓</span>
        {cartToast} added to cart!
      </div>

      {funFactPopup && (
        <div onClick={() => setFunFactPopup(null)} style={{ position: "absolute", top: funFactPopup.y - 90, left: Math.min(funFactPopup.x - 120, window.innerWidth - 300), background: "#1a1a1a", color: "white", padding: "14px 18px", borderRadius: 14, maxWidth: 280, fontSize: "0.84rem", lineHeight: 1.5, zIndex: 9999, boxShadow: "0 8px 32px rgba(0,0,0,0.35)", cursor: "pointer", animation: "fadeSlideIn 0.25s ease" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4, color: "#F59E0B", fontSize: "0.75rem", letterSpacing: "0.06em" }}>FUN FACT</div>
              {funFactPopup.fact}
            </div>
          </div>
          <div style={{ marginTop: 10, height: 3, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#F59E0B", borderRadius: 3, animation: "shrink 4s linear forwards" }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shrink { from { width:100%; } to { width:0%; } }
        .review-input:focus { border-color: #F88435 !important; outline: none; }
      `}</style>

      <div className="container"><Navbar /></div>

      <div style={{ height: "300px", position: "relative" }}>
        <img src={restaurant.image} alt={restaurant.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.8))", padding: "40px 20px 20px", color: "white" }}>
          <div className="container">
            <h1 style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{restaurant.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <p style={{ fontSize: "1.1rem", opacity: 0.9, margin: 0 }}>{restaurant.categories.join(", ")}</p>
              {reviewCount > 0 && (
                <span style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.15)", padding: "4px 12px", borderRadius: 20, fontSize: "0.88rem" }}>
                  {renderStars(Math.round(reviewAvg), false, "0.8rem")}
                  <span style={{ fontWeight: 700 }}>{reviewAvg}</span>
                  <span style={{ opacity: 0.75 }}>({reviewCount} review{reviewCount !== 1 ? "s" : ""})</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "40px 20px" }}>
        <h2 style={{ marginBottom: "24px" }}>Menu</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {menu.map(item => (
            <div key={item._id} style={{ border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "200px", position: "relative" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {item.funFact && (
                  <button onClick={(e) => showFunFact(e, item.funFact)} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.92)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", transition: "transform 0.15s" }} onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")} onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
                    <i className="fa-solid fa-lightbulb" style={{ color: "#F59E0B" }}></i>
                  </button>
                )}
              </div>
              <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{item.name}</h3>
                  <span style={{ fontWeight: 600, color: "var(--primary-color)" }}>${item.price.toFixed(2)}</span>
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-light)", marginBottom: "12px", flex: 1 }}>{item.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-light)" }}><i className="fa-solid fa-fire"></i> {item.calories} kcal</span>
                  <button onClick={() => handleAddToCart(item)} className="btn btn-primary" style={{ padding: "6px 12px", fontSize: "0.9rem" }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* REVIEWS SECTION */}
        <div style={{ marginTop: 60 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
            <div>
              <h2 style={{ margin: "0 0 4px" }}>Reviews</h2>
              {reviewCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {renderStars(Math.round(reviewAvg), false, "1rem")}
                  <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{reviewAvg}</span>
                  <span style={{ color: "#999", fontSize: "0.88rem" }}>from {reviewCount} review{reviewCount !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          </div>

          {/* Write review form */}
          <div style={{ background: "#FFF8F3", borderRadius: 16, padding: 24, marginBottom: 32, border: "1px solid #FFE8D6" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "1rem", color: "#333" }}>
              {existingReview ? "✏️ Update Your Review" : "⭐ Write a Review"}
            </h3>
            {!user ? (
              <p style={{ color: "#999", fontSize: "0.9rem", margin: 0 }}>Please <a href="/login" style={{ color: "#F88435", fontWeight: 600 }}>log in</a> to leave a review.</p>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#999", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Your Rating</div>
                  <div style={{ display: "flex", gap: 4 }}>{renderStars(myRating, true, "1.6rem")}</div>
                </div>
                <textarea
                  className="review-input"
                  value={myComment}
                  onChange={e => setMyComment(e.target.value)}
                  placeholder="Share your experience with this restaurant..."
                  rows={3}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid #eee", fontSize: "0.92rem", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", background: "white", transition: "border-color 0.2s" }}
                />
                {submitMsg && (
                  <div style={{ padding: "8px 14px", borderRadius: 8, background: submitMsg.includes("submitted") ? "#D1FAE5" : "#FEE2E2", color: submitMsg.includes("submitted") ? "#065F46" : "#991B1B", fontSize: "0.85rem", marginTop: 8 }}>
                    {submitMsg}
                  </div>
                )}
                <button onClick={submitReview} disabled={submitting} style={{ marginTop: 12, background: "#F88435", color: "white", border: "none", borderRadius: 30, padding: "11px 28px", fontWeight: 700, fontSize: "0.9rem", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
                </button>
              </>
            )}
          </div>

          {/* Review list */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#bbb" }}>
              <i className="fa-regular fa-star" style={{ fontSize: "2.5rem", marginBottom: 12, display: "block" }}></i>
              <p style={{ margin: 0, fontWeight: 600 }}>No reviews yet</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.85rem" }}>Be the first to share your experience!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reviews.map((r: any) => (
                <div key={r._id} style={{ background: "white", borderRadius: 14, padding: "18px 20px", border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #F88435, #FF6B35)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "0.8rem", flexShrink: 0 }}>
                        {r.userName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{r.userName}</div>
                        <div style={{ fontSize: "0.75rem", color: "#bbb" }}>{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {renderStars(r.rating, false, "0.85rem")}
                      {user && (user.id === r.userId || user.id === r.userId?._id || user.role === "admin") && (
                        <button onClick={() => deleteReview(r._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "2px 6px", fontSize: "0.78rem" }} title="Delete">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#444", lineHeight: 1.55 }}>{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

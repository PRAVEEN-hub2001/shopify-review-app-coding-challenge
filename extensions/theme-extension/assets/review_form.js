
const name = document.getElementById('name');
const rating = document.getElementById('rating-value');
const comment = document.getElementById('comment');
const submit = document.getElementById('review_form');
const msg = document.getElementById('msg-content');
const productId = window.ShopifyAnalytics.meta.product.id;

const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', () => {
        const value = star.getAttribute('data-value');
        rating.value = value;
        stars.forEach(s => s.classList.remove('selected'));
        for (let i = 0; i < value; i++) {
            stars[i].classList.add('selected');
        }
    });

    star.addEventListener('mouseover', () => {
        const value = star.getAttribute('data-value');
        stars.forEach((s, i) => {
            if (i < value) s.classList.add('selected');
            else s.classList.remove('selected');
        });
    });

    star.addEventListener('mouseout', () => {
        const value = rating.value;
        stars.forEach((s, i) => {
            if (i < value) s.classList.add('selected');
            else s.classList.remove('selected');
        });
    });
});


submit.addEventListener('submit', async function (event) {
    event.preventDefault();

    const postData = {
        productId,
        name: name.value,
        rating: rating.value,
        comment: comment.value
    }

    await fetch("https://mai-my-store.myshopify.com/apps/proxy", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
            if (!data.success) {
                throw new Error('Success status was not ok');
            }
            msg.classList.add("success");
            msg.innerHTML = data.message || "Operation was successful";
            setTimeout(() => {
                msg.classList.remove("success");
                msg.innerHTML = '';
            }, 10000);

            name.value = '';
            rating.value = 0;
            comment.value = '';
        })
        .catch((error) => {
            console.error("Fetch error:", error);
            msg.classList.add("error");
            msg.innerHTML = 'Something went wrong!';
            setTimeout(() => {
                msg.classList.remove("error");
                msg.innerHTML = '';
            }, 10000);
        });
});

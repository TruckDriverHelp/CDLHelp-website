import React from 'react';
import Link from 'next/link';
import Image from 'next/image'

const BlogSidebar = () => {
	return (
		<>
			<div className="widget-area">
				<div style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
					<Link href="/">
						<Image src="/images/cdl-app-banner.jpg" alt="user" width={300} height={500} />
					</Link>

				</div>
				<div className="widget widget_posts_thumb">
					<h3 className="widget-title">Popular Posts</h3>

					<article className="item">
						<Link href="/blog-details">
							<a className="thumb">
								<span className="fullimage cover bg1" role="img"></span>
							</a>
						</Link>
						<div className="info">
							<h4 className="title usmall">
								<Link href="/blog-details">
									<a>Being The Best-Selling Smart Phone This Year</a>
								</Link>
							</h4>
							<span className="date">
								<i className="ri-calendar-2-fill"></i> Jan 15, 2020
							</span>
						</div>
					</article>

					<article className="item">
						<Link href="/blog-details">
							<a className="thumb">
								<span className="fullimage cover bg2" role="img"></span>
							</a>
						</Link>
						<div className="info">
							<h4 className="title usmall">
								<Link href="/blog-details">
									<a>Love Songs Helped Me Through Heartbreak</a>
								</Link>
							</h4>
							<span className="date">
								<i className="ri-calendar-2-fill"></i> Jan 14, 2020
							</span>
						</div>
					</article>

					<article className="item">
						<Link href="/blog-details">
							<a className="thumb">
								<span className="fullimage cover bg3" role="img"></span>
							</a>
						</Link>
						<div className="info">
							<h4 className="title usmall">
								<Link href="/blog-details">
									<a>Two Fashion Designers Busy With 2020 Winter Fashion</a>
								</Link>
							</h4>
							<span className="date">
								<i className="ri-calendar-2-fill"></i> Jan 13, 2020
							</span>
						</div>
					</article>

					<article className="item">
						<Link href="/blog-details">
							<a className="thumb">
								<span className="fullimage cover bg4" role="img"></span>
							</a>
						</Link>
						<div className="info">
							<h4 className="title usmall">
								<Link href="/blog-details">
									<a>Working in the Office is a Tradition For Women</a>
								</Link>
							</h4>
							<span className="date">
								<i className="ri-calendar-2-fill"></i> Jan 12, 2020
							</span>
						</div>
					</article>
				</div>
			</div>
		</>
	)
}

export default BlogSidebar;
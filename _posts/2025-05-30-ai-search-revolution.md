---
title: The AI search revolution
description: How conversational search is reshaping media, publishers, and the web economy
author: steve
date: 2025-05-30 22:37:58 +0700
categories:
  - English
tags:
  - AI
  - marketing
  - media
  - revolution
pin: false
toc: true
math: false
mermaid: false
chart: true
image:
  path: /assets/img/post/the-ai-search.gif
  lqip: data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAwAQCdASoQAAkABUB8JaQAA3AA/vAu8iB/p5yxaAAAAA==
  alt: Google in the AI search wave - Google
---
> *The rise of AI-powered search tools like ChatGPT, Perplexity, and Google's AI Overviews represents one of the most significant shifts in how we consume information since the advent of the modern web. But beneath the surface of this technological evolution lies a fundamental disruption that could reshape the entire digital content ecosystem.*

It's 2 a.m. in Mumbai. A student hunches over her laptop, chasing answers for a research paper. Ten years ago, she'd feed keywords to Google, then wade through pages of blue links. Tonight, she asks a simple question—"How does climate change impact coastal economies?"—and gets a conversational answer in seconds. No clicks. No hunting.

Across the world, a farmer in Kenya queries crop strategies through his phone's voice AI. A marketer in London synthesizes competitor insights instantly. This is happening everywhere, quietly reshaping how seven billion people seek knowledge.

We're witnessing something profound. Not just another tech upgrade, but a fundamental shift in humanity's relationship with information.

## The death of keywords?

The transition from traditional search to conversational AI feels like moving from a library's card catalog to having a wise librarian at your fingertips—one who never sleeps, never tires, and always listens.

Google still holds 90% of search traffic. But the numbers tell a different story. AI tools like ChatGPT and Perplexity are projected to capture 2-3% of searches by mid-2025. Over 80% of organizations now weave AI into their operations, up from 60% last year. AI literacy has become the top skill in 2025's job market.

These aren't just statistics. They're early signals of a tidal wave.

```chart
{
  "type": "doughnut",
  "data": {
    "labels": ["Google Search", "Bing", "ChatGPT", "Other AI search", "Traditional search engines"],
    "datasets": [{
      "data": [89.5, 4.0, 3.0, 1.5, 2.0],
      "backgroundColor": [
        "rgba(66, 133, 244, 0.3)",
        "rgba(0, 161, 241, 0.3)", 
        "rgba(16, 163, 127, 0.3)",
        "rgba(255, 107, 107, 0.3)",
        "rgba(149, 165, 166, 0.3)"
      ],
      "borderColor": ["#4285F4", "#00A1F1", "#10A37F", "#FF6B6B", "#95A5A6"],
      "borderWidth": 1
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Search market share - Mid 2025 (%)"
      },
      "legend": {
        "position": "bottom"
      }
    }
  }
}
```

## The Zero-Click

Imagine running a small news outlet in Chicago. For years, Google search drove readers to your site. Ad clicks paid the bills. Then AI Overviews launched. Suddenly, visitors dropped 5-15%. The AI answered questions directly. No clicks required.

The projections for 2025 are stark: organic traffic could fall 10-50%, depending on AI adoption rates. Publishers stand to lose over $2 billion in ad revenue annually. Why? AI delivers answers directly, with less than 2% of queries resulting in outbound traffic to most media sites.

This is the zero-click cliff. And we're all standing at its edge.

```chart
{
  "type": "bar",
  "data": {
    "labels": ["Current impact (2024)", "Conservative projection (2025)", "Dramatic projection (2025)"],
    "datasets": [{
      "label": "Traffic decline (%)",
      "data": [10, 20, 45],
      "backgroundColor": ["rgba(255, 107, 107, 0.3)", "rgba(255, 165, 0, 0.3)", "rgba(220, 20, 60, 0.3)"],
      "borderColor": ["#FF4444", "#FF8C00", "#B22222"],
      "borderWidth": 1
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Publisher traffic impact from AI search (2024-2025)"
      }
    },
    "scales": {
      "y": {
        "beginAtZero": true,
        "max": 50,
        "title": {
          "display": true,
          "text": "Traffic decline (%)"
        }
      }
    }
  }
}
```

The ripple effects run deep. Less ad revenue means less investment in journalism. Content quality suffers. Only media giants with AI partnerships survive. The long tail of diverse voices begins to disappear.

## Three forces in collision

This isn't just about technology. It's about power, economics, and the future of human knowledge. Three forces are colliding:

**AI companies** want to deliver instant answers. But they depend on content they might accidentally starve. Their solution? Revenue-sharing deals and licensing agreements. A delicate balance between efficiency and sustainability.

**Publishers** find themselves caught between shrinking traffic and rising costs. They're pivoting desperately—chasing subscriptions, negotiating AI deals, creating sponsored content. Small players risk extinction. Only the agile survive.

**Users** gain unprecedented convenience. Fast, conversational search that feels natural. But at what cost? If content creators can't survive, we all lose diversity of thought and depth of reporting.

## The new economics of attention

Some pioneers are experimenting with solutions. Perplexity has licensing deals with 14 media partners. Google tweaks AI Overviews to include more source links. Publishers chase direct subscriptions and premium content models.

But the fundamental question remains: Can AI search support content creators fairly while keeping answers free and instant?

The answer will shape the next decade of human knowledge.

## A global shift

This transformation touches everyone, everywhere. Students in São Paulo use AI for research, bypassing traditional academic databases. Businesses in Tokyo replace multi-source research with AI-generated reports. Marketers worldwide rethink SEO for conversational queries.

```chart
{
  "type": "line",
  "data": {
    "labels": ["2023", "2024", "2025", "2026", "2027"],
    "datasets": [{
      "label": "AI search adoption (%)",
      "data": [5, 15, 30, 50, 70],
      "borderColor": "#FF69B4",
      "backgroundColor": "rgba(255, 105, 180, 0.2)",
      "tension": 0.4,
      "fill": true
    }, {
      "label": "Traditional search usage (%)",
      "data": [95, 85, 70, 50, 30],
      "borderColor": "#4285F4",
      "backgroundColor": "rgba(66, 133, 244, 0.1)",
      "tension": 0.4,
      "fill": true
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Search method usage projection (2023-2027)"
      }
    },
    "scales": {
      "y": {
        "beginAtZero": true,
        "max": 100,
        "title": {
          "display": true,
          "text": "Usage percentage"
        }
      }
    }
  }
}
```

We're watching the crossing of two lines. The moment when AI search becomes dominant. It's happening faster than most predicted.

## The reality check

AI search dazzles, but it's far from perfect. Tools like ChatGPT sometimes hallucinate facts, misattribute sources, or lag on breaking news. Real-time updates are closing these gaps, but slowly.

Sometimes I use [Ithy](https://ithy.com) to aggregate answers from ChatGPT, Gemini, DeepSeek, Perplexity, and Grok—combining multiple AI perspectives into one view. Even then, verification remains essential.

```chart
{
  "type": "radar",
  "data": {
    "labels": ["Accuracy", "Attribution", "Recency", "Coverage", "Speed", "User experience"],
    "datasets": [{
      "label": "Traditional search",
      "data": [85, 90, 92, 98, 75, 70],
      "backgroundColor": "rgba(66, 133, 244, 0.2)",
      "borderColor": "#4285F4",
      "borderWidth": 2
    }, {
      "label": "AI Search",
      "data": [70, 50, 75, 85, 95, 92],
      "backgroundColor": "rgba(255, 105, 180, 0.2)",
      "borderColor": "#FF69B4",
      "borderWidth": 2
    }]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "title": {
        "display": true,
        "text": "Search performance comparison - Mid 2025 (Score out of 100)"
      }
    },
    "scales": {
      "r": {
        "beginAtZero": true,
        "max": 100
      }
    }
  }
}
```

We're in transition. AI complements traditional search rather than replacing it entirely. For now.

## Three possible futures

**Coexistence**: AI and traditional search divide responsibilities. Publishers blend revenue models. Quality content retains value. This seems likely for the next 2-3 years.

**AI Dominance with fair compensation**: AI dominates search, but robust revenue-sharing sustains content creators. New attribution standards emerge. Possible in 3-5 years if stakeholders collaborate.

**The content drought**: AI rules search, but compensation models fail. Original content and quality journalism decline dramatically. A worrying scenario, but hopefully the least likely.

Which future we get depends on decisions made in the next 24 months.

## The current snapshot

```chart
{
  "type": "line",
  "data": {
    "labels": ["6 months ago", "3 months ago", "1 month ago", "May 2025"],
    "datasets": [
      {
        "label": "ChatGPT",
        "data": [10, 12, 15, 18],
        "borderColor": "#FF6384",
        "backgroundColor": "rgba(255, 99, 132, 0.1)",
        "fill": true,
        "tension": 0.4
      },
      {
        "label": "Google",
        "data": [80, 78, 75, 73],
        "borderColor": "#36A2EB",
        "backgroundColor": "rgba(54, 162, 235, 0.1)",
        "fill": true,
        "tension": 0.4
      },
      {
        "label": "Perplexity",
        "data": [2, 3, 4, 5],
        "borderColor": "#FFCE56",
        "backgroundColor": "rgba(255, 206, 86, 0.1)",
        "fill": true,
        "tension": 0.4
      },
      {
        "label": "Other AI tools",
        "data": [8, 7, 6, 4],
        "borderColor": "#4BC0C0",
        "backgroundColor": "rgba(75, 192, 192, 0.1)",
        "fill": true,
        "tension": 0.4
      }
    ]
  },
  "options": {
    "responsive": true,
    "plugins": {
      "legend": {
        "position": "top"
      },
      "title": {
        "display": true,
        "text": "GenAI traffic share over time (%) - Similarweb 2025"
      }
    },
    "scales": {
      "y": {
        "beginAtZero": true,
        "title": {
          "display": true,
          "text": "Traffic share (%)"
        }
      },
      "x": {
        "title": {
          "display": true,
          "text": "Time period"
        }
      }
    }
  }
}
```

Google's dominance is eroding slowly but steadily. ChatGPT's growth accelerates. These aren't just numbers—they represent millions of shifted behaviors, billions of redirected attention minutes.

## What this means?

**Publishers**: Diversify revenue streams. Secure AI partnerships early. Create content that AI can't easily replicate—deep reporting, unique perspectives, human insight. Build direct relationships with readers.

**Marketers**: Optimize for conversational queries. Become the authoritative source AI tools cite. Develop AI literacy as a core competency, not an afterthought.

**Users**: Verify AI answers against original sources. Support quality journalism through subscriptions. Understand AI's limitations while embracing its capabilities.

## The question

As AI search grows, we face a fundamental question about knowledge itself: Who controls the answers?

Will AI democratize information access or create new gatekeepers? Can we maintain diverse perspectives in a world of algorithmic summaries? Will convenience come at the cost of curiosity and serendipitous discovery?

These questions matter more than market share percentages or revenue projections. They're about the future of human learning, creativity, and understanding.

## The path forward

I'll be honest—I'm conflicted about AI. I don't enjoy reading AI-generated content. I don't trust AI photos or videos. I prefer human-created, human-verified information. But my preferences won't stop this transformation.

As a marketer, I see the writing on the wall. Search engines are the most important pathway in every customer journey. If that changes fundamentally, everything else changes too. Advertising models, media distribution, web traffic patterns—all of it gets rewritten.

The questions multiply faster than answers: How will businesses reach customers? How will journalists get paid? How will we maintain information quality and diversity?

We can't answer these questions today. But we can prepare for them.

## What happens next?

The AI search wave is here. Its legacy depends on what happens in the next 2-3 years. Can AI companies, content creators, and policymakers collaborate to balance instant answers with a thriving information ecosystem?

For everyone involved—creators, marketers, readers—staying adaptable is essential. The rules are being rewritten in real-time. Those who understand the new game early will thrive. Those who ignore it will struggle.

The revolution is quiet but unstoppable. The question isn't whether it will happen, but how we'll shape it.

And that's still up to us.

> *This transformation impacts everyone. In a world of instant answers, the most valuable skill may be learning to ask better questions.*
{: .note-important }

---

## References
- Search Engine Land, "[ChatGPT Search Market Share Could Hit 1 Percent](https://searchengineland.com/chatgpt-search-market-share-1-percent-449378)"
- Gartner, "[Artificial Intelligence Insights](https://www.gartner.com/en/information-technology/insights/artificial-intelligence)"
- HAI, "[2025 AI Index Report](https://hai.stanford.edu/ai-index/2025-ai-index-report)"
- Semrush, "[Semrush AI Overviews Study](https://www.semrush.com/blog/semrush-ai-overviews-study/)"
- Ahrefs, "[AI Overviews Reduce Clicks](https://ahrefs.com/blog/ai-overviews-reduce-clicks/)"
- Fast Company, "[AI Search Wave Signals Media Disruption](https://www.fastcompany.com/91342332/ai-search-wave-media-disruption)"  
- Chartbeat, "[Global Audience Insights First Quarter 2025](https://chartbeat.com/resources/articles/global-audience-insights-first-quarter-2025/)"
